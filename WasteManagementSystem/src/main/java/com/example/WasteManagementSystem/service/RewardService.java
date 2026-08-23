package com.example.WasteManagementSystem.service;

import com.example.WasteManagementSystem.dto.CertificateResponse;
import com.example.WasteManagementSystem.dto.LeaderboardResponse;
import com.example.WasteManagementSystem.dto.RewardCatalogItemResponse;
import com.example.WasteManagementSystem.dto.RewardResponse;
import com.example.WasteManagementSystem.dto.RewardSummaryResponse;
import com.example.WasteManagementSystem.entity.Certificate;
import com.example.WasteManagementSystem.entity.Reward;
import com.example.WasteManagementSystem.entity.User;
import com.example.WasteManagementSystem.repository.CertificateRepository;
import com.example.WasteManagementSystem.repository.RewardRepository;
import com.example.WasteManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RewardService {

    private final RewardRepository rewardRepository;
    private final UserRepository userRepository;
    private final CertificateRepository certificateRepository;

    private static final SecureRandom RANDOM = new SecureRandom();


    // =========================================================
    // 1. ADD REWARD POINTS
    // =========================================================

    public void addPoints(
            User user,
            int points,
            String reason) {

        if (user == null) {
            throw new IllegalArgumentException(
                    "User cannot be null"
            );
        }

        if (points <= 0) {
            throw new IllegalArgumentException(
                    "Reward points must be greater than 0"
            );
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Reward reason cannot be empty"
            );
        }


        Reward reward = Reward.builder()
                .user(user)
                .points(points)
                .reason(reason.trim())
                .createdAt(LocalDateTime.now())
                .build();


        rewardRepository.save(reward);
    }


    // =========================================================
    // 1B. REDEEM CATALOG
    // =========================================================
    //
    // Fixed catalogue of redeemable rewards. Kept server-side (instead
    // of trusting whatever the client sends) so a user can't redeem a
    // reward for fewer points than it actually costs. No new table is
    // needed for the point ledger - redemptions are stored as ordinary
    // Reward rows with a negative point value, using the existing
    // "rewards" table. Every successful redemption also mints a
    // unique Certificate row (see issueCertificate()).
    // =========================================================

    private record RewardCatalogItem(
            String name,
            String description,
            int points,
            String icon) {}

    private static final Map<Long, RewardCatalogItem> REWARD_CATALOG =
            new LinkedHashMap<>();

    static {
        REWARD_CATALOG.put(1L, new RewardCatalogItem(
                "Eco Certificate",
                "A shareable digital certificate recognising your environmental contribution.",
                100, "\uD83C\uDFC6"));
        REWARD_CATALOG.put(2L, new RewardCatalogItem(
                "Green Badge",
                "Unlock the Eco Champion badge on your profile.",
                250, "\uD83C\uDF31"));
        REWARD_CATALOG.put(3L, new RewardCatalogItem(
                "Eco Champion",
                "Premium recognition for outstanding environmental impact.",
                500, "\u267B"));
        REWARD_CATALOG.put(4L, new RewardCatalogItem(
                "Reusable Tote Bag",
                "A RecycleX branded reusable shopping bag, delivered to your door.",
                150, "\uD83D\uDC5C"));
        REWARD_CATALOG.put(5L, new RewardCatalogItem(
                "Plantable Sapling Kit",
                "A starter kit with a sapling and soil to grow your own tree.",
                200, "\uD83C\uDF33"));
        REWARD_CATALOG.put(6L, new RewardCatalogItem(
                "Eco Store Voucher",
                "A voucher redeemable at partnered eco-friendly stores.",
                350, "\uD83C\uDF9F"));
        REWARD_CATALOG.put(7L, new RewardCatalogItem(
                "Community Cleanup Kit",
                "Gloves, bags and tools to lead your own neighbourhood cleanup.",
                450, "\uD83E\uDDE4"));
        REWARD_CATALOG.put(8L, new RewardCatalogItem(
                "Platinum Eco Legend",
                "The highest honour - a premium certificate and city recognition.",
                1000, "\uD83D\uDC8E"));
    }


    // =========================================================
    // 1C. GET REWARD CATALOG
    // =========================================================

    @Transactional(readOnly = true)
    public List<RewardCatalogItemResponse> getCatalog() {

        return REWARD_CATALOG.entrySet()
                .stream()
                .map(entry -> new RewardCatalogItemResponse(
                        entry.getKey(),
                        entry.getValue().name(),
                        entry.getValue().description(),
                        entry.getValue().points(),
                        entry.getValue().icon()
                ))
                .toList();
    }


    // =========================================================
    // 1D. REDEEM REWARD
    // =========================================================

    public RewardSummaryResponse redeemReward(
            String email,
            Long catalogRewardId) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        RewardCatalogItem item =
                REWARD_CATALOG.get(catalogRewardId);

        if (item == null) {
            throw new IllegalArgumentException(
                    "This reward does not exist."
            );
        }

        int currentPoints =
                getTotalPoints(email);

        if (currentPoints < item.points()) {
            throw new IllegalArgumentException(
                    "You do not have enough points to redeem \"" +
                            item.name() + "\"."
            );
        }

        Reward redemption = Reward.builder()
                .user(user)
                .points(-item.points())
                .reason("Redeemed: " + item.name())
                .createdAt(LocalDateTime.now())
                .build();

        rewardRepository.save(redemption);

        issueCertificate(user, item.name(), item.points());

        return getMyRewards(email);
    }


    // =========================================================
    // 1E. ISSUE CERTIFICATE
    // =========================================================
    //
    // Every redemption mints its own certificate: a unique code,
    // the recipient's name, what was redeemed, how many points it
    // cost and an encouraging message. Never reused across
    // redemptions, even for the same reward.
    // =========================================================

    private static final List<String> ENCOURAGING_MESSAGES = List.of(
            "Your dedication to a cleaner, greener community truly makes a difference. Keep up the great work!",
            "Every report, pickup and recycling effort adds up - thank you for helping build a healthier city!",
            "Small actions create big change. Your commitment to sustainability inspires us all!",
            "Thank you for going above and beyond for our environment. This achievement is well earned!",
            "Your consistent effort is helping shape a cleaner tomorrow. Congratulations on this milestone!"
    );

    private void issueCertificate(
            User user,
            String rewardName,
            int pointsSpent) {

        String code = generateCertificateCode();

        String message =
                ENCOURAGING_MESSAGES.get(
                        RANDOM.nextInt(ENCOURAGING_MESSAGES.size())
                );

        Certificate certificate = Certificate.builder()
                .user(user)
                .certificateCode(code)
                .rewardName(rewardName)
                .pointsSpent(pointsSpent)
                .issuedAt(LocalDateTime.now())
                .message(message)
                .build();

        certificateRepository.save(certificate);
    }

    private String generateCertificateCode() {

        String code;

        do {
            code = "RX-" + randomAlphaNumeric(8);
        } while (certificateRepository.existsByCertificateCode(code));

        return code;
    }

    private String randomAlphaNumeric(int length) {

        final String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        StringBuilder builder = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            builder.append(
                    chars.charAt(RANDOM.nextInt(chars.length()))
            );
        }

        return builder.toString();
    }


    // =========================================================
    // 1F. CERTIFICATES - LIST / LOOKUP
    // =========================================================

    @Transactional(readOnly = true)
    public List<CertificateResponse> getMyCertificates(String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        return certificateRepository
                .findByUserOrderByIssuedAtDesc(user)
                .stream()
                .map(this::toCertificateResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CertificateResponse getCertificateByCode(
            String email,
            String code) {

        Certificate certificate =
                certificateRepository.findByCertificateCode(code)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Certificate not found"
                                ));

        if (!certificate.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException(
                    "Certificate not found"
            );
        }

        return toCertificateResponse(certificate);
    }

    private CertificateResponse toCertificateResponse(Certificate certificate) {

        return new CertificateResponse(
                certificate.getId(),
                certificate.getCertificateCode(),
                certificate.getUser().getName(),
                certificate.getRewardName(),
                certificate.getPointsSpent(),
                certificate.getIssuedAt(),
                certificate.getMessage()
        );
    }


    // =========================================================
    // 2. GET MY REWARDS
    // =========================================================

    @Transactional(readOnly = true)
    public RewardSummaryResponse getMyRewards(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));


        List<Reward> rewards =
                rewardRepository
                        .findByUserOrderByCreatedAtDesc(user);


        // =====================================================
        // CALCULATE TOTAL POINTS
        // =====================================================

        int totalPoints =
                rewards.stream()
                        .mapToInt(Reward::getPoints)
                        .sum();


        // =====================================================
        // REWARD HISTORY
        // =====================================================

        List<RewardResponse> history =
                rewards.stream()
                        .map(reward ->
                                new RewardResponse(
                                        reward.getId(),
                                        reward.getPoints(),
                                        reward.getReason(),
                                        reward.getCreatedAt()
                                )
                        )
                        .toList();


        return new RewardSummaryResponse(
                totalPoints,
                history
        );
    }


    // =========================================================
    // 3. LEADERBOARD
    // =========================================================

    @Transactional(readOnly = true)
    public List<LeaderboardResponse> getLeaderboard() {

        List<Reward> rewards =
                rewardRepository
                        .findAllByOrderByCreatedAtDesc();


        // =====================================================
        // GROUP REWARDS BY USER
        // =====================================================

        Map<User, List<Reward>> rewardsByUser =
                rewards.stream()
                        .collect(
                                Collectors.groupingBy(
                                        Reward::getUser
                                )
                        );


        // =====================================================
        // CALCULATE USER TOTALS
        // =====================================================

        List<UserPoints> userPointsList =
                rewardsByUser.entrySet()
                        .stream()
                        .map(entry -> {

                            User user =
                                    entry.getKey();

                            int totalPoints =
                                    entry.getValue()
                                            .stream()
                                            .mapToInt(
                                                    Reward::getPoints
                                            )
                                            .sum();

                            return new UserPoints(
                                    user,
                                    totalPoints
                            );
                        })
                        .sorted(
                                Comparator
                                        .comparingInt(
                                                UserPoints::getPoints
                                        )
                                        .reversed()
                                        .thenComparing(
                                                up ->
                                                        up.getUser()
                                                                .getName(),
                                                Comparator.nullsLast(
                                                        String.CASE_INSENSITIVE_ORDER
                                                )
                                        )
                        )
                        .toList();


        // =====================================================
        // CREATE LEADERBOARD
        // =====================================================

        List<LeaderboardResponse> leaderboard =
                new ArrayList<>();


        int rank = 1;


        for (UserPoints userPoints :
                userPointsList) {

            User user =
                    userPoints.getUser();


            leaderboard.add(
                    new LeaderboardResponse(
                            rank,
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            userPoints.getPoints()
                    )
            );

            rank++;
        }


        return leaderboard;
    }


    // =========================================================
    // 4. GET TOTAL POINTS FOR USER
    // =========================================================

    @Transactional(readOnly = true)
    public int getTotalPoints(String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));


        return rewardRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .mapToInt(Reward::getPoints)
                .sum();
    }


    // =========================================================
    // 5. USER POINTS HELPER CLASS
    // =========================================================

    private static class UserPoints {

        private final User user;
        private final int points;


        public UserPoints(
                User user,
                int points) {

            this.user = user;
            this.points = points;
        }


        public User getUser() {
            return user;
        }


        public int getPoints() {
            return points;
        }
    }
}
