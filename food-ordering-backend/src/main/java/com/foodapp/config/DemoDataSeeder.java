package com.foodapp.config;

import com.foodapp.model.Category;
import com.foodapp.model.FoodItem;
import com.foodapp.model.Restaurant;
import com.foodapp.model.Role;
import com.foodapp.model.User;
import com.foodapp.repository.CategoryRepository;
import com.foodapp.repository.FoodRepository;
import com.foodapp.repository.RestaurantRepository;
import com.foodapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DemoDataSeeder {

    @Bean
    CommandLineRunner seedDemoData(
            UserRepository userRepository,
            RestaurantRepository restaurantRepository,
            CategoryRepository categoryRepository,
            FoodRepository foodRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            System.out.println("==========================================");
            System.out.println("Starting FoodHub demo data seeding...");
            System.out.println("==========================================");

            /*
             * USERS
             */

            User owner1 = createOrGetUser(
                    userRepository,
                    passwordEncoder,
                    "owner1@foodhub.com",
                    "Arjun Mehta",
                    "9876501001",
                    "Owner@12345",
                    Role.RESTAURANT_OWNER
            );

            User owner2 = createOrGetUser(
                    userRepository,
                    passwordEncoder,
                    "owner2@foodhub.com",
                    "Priya Sharma",
                    "9876501002",
                    "Owner@12345",
                    Role.RESTAURANT_OWNER
            );

            User owner3 = createOrGetUser(
                    userRepository,
                    passwordEncoder,
                    "owner3@gmail.com",
                    "Rahul Kumar",
                    "9876501003",
                    "Owner@12345",
                    Role.RESTAURANT_OWNER
            );

            createOrGetUser(
                    userRepository,
                    passwordEncoder,
                    "customer1@foodhub.com",
                    "Aarav Menon",
                    "9876502001",
                    "Customer@12345",
                    Role.CUSTOMER
            );

            createOrGetUser(
                    userRepository,
                    passwordEncoder,
                    "customer2@foodhub.com",
                    "Ananya Iyer",
                    "9876502002",
                    "Customer@12345",
                    Role.CUSTOMER
            );

            createOrGetUser(
                    userRepository,
                    passwordEncoder,
                    "customer3@foodhub.com",
                    "Vikram Rao",
                    "9876502003",
                    "Customer@12345",
                    Role.CUSTOMER
            );

            /*
             * RESTAURANTS
             */

            Restaurant restaurant1 = createOrUpdateRestaurant(
                    restaurantRepository,
                    owner1,
                    "Spice Route Kitchen",
                    "A modern Indian kitchen serving aromatic biryanis, rich curries, tandoor favourites and freshly baked breads.",
                    "Anna Nagar, Chennai",
                    "+91 98765 30101",
                    "North Indian",
                    4.6,
                    30,
                    550,
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
                    true,
                    true
            );

            Restaurant restaurant2 = createOrUpdateRestaurant(
                    restaurantRepository,
                    owner2,
                    "Green Leaf Bistro",
                    "Fresh vegetarian favourites inspired by South Indian comfort food, wholesome rice meals and contemporary café dishes.",
                    "Adyar, Chennai",
                    "+91 98765 30102",
                    "South Indian",
                    4.5,
                    25,
                    400,
                    "https://images.unsplash.com/photo-1552566626-52f8b828add9",
                    true,
                    true
            );

            Restaurant restaurant3 = createOrUpdateRestaurant(
                    restaurantRepository,
                    owner3,
                    "Urban Wok House",
                    "Asian-inspired comfort food featuring wok-tossed noodles, fried rice, dumplings and bold street-style starters.",
                    "T. Nagar, Chennai",
                    "+91 98765 30103",
                    "Chinese",
                    4.4,
                    28,
                    500,
                    "https://images.unsplash.com/photo-1552566626-52f8b828add9",
                    true,
                    true
            );

            /*
             * Existing Niyas restaurant:
             *
             * Your database already contains a restaurant named "Niyas".
             * We migrate that record to "Niyas Kitchen" instead of creating
             * a duplicate restaurant.
             *
             * Rating remains 0 because there is no actual rating data yet.
             */
            Restaurant restaurant4 = createOrUpdateNiyasKitchen(
                    restaurantRepository,
                    owner3
            );

            /*
             * NEW RESTAURANTS
             *
             * These are created as separate restaurant records.
             * They do NOT overwrite another restaurant owned by the same user.
             */

            Restaurant restaurant5 = createOrUpdateRestaurant(
                    restaurantRepository,
                    owner1,
                    "Desert Flame",
                    "A warm Arabian kitchen serving grilled meats, smoky kebabs, rice platters and comforting Middle Eastern favourites.",
                    "Velachery, Chennai",
                    "+91 98765 30105",
                    "Arabian",
                    0.0,
                    32,
                    600,
                    "",
                    true,
                    true
            );

            Restaurant restaurant6 = createOrUpdateRestaurant(
                    restaurantRepository,
                    owner2,
                    "Stack & Grill",
                    "A casual burger and grill kitchen serving loaded burgers, crispy sides, grilled favourites and refreshing drinks.",
                    "Nungambakkam, Chennai",
                    "+91 98765 30106",
                    "Burgers & Fast Food",
                    0.0,
                    27,
                    450,
                    "",
                    true,
                    true
            );

            /*
             * CATEGORIES + FOOD
             */

            seedSpiceRoute(
                    categoryRepository,
                    foodRepository,
                    restaurant1
            );

            seedGreenLeaf(
                    categoryRepository,
                    foodRepository,
                    restaurant2
            );

            seedUrbanWok(
                    categoryRepository,
                    foodRepository,
                    restaurant3
            );

            seedNiyasKitchen(
                    categoryRepository,
                    foodRepository,
                    restaurant4
            );

            seedDesertFlame(
                    categoryRepository,
                    foodRepository,
                    restaurant5
            );

            seedStackAndGrill(
                    categoryRepository,
                    foodRepository,
                    restaurant6
            );

            System.out.println("==========================================");
            System.out.println("FoodHub demo data seeding completed.");
            System.out.println("6 restaurants configured.");
            System.out.println("==========================================");
        };
    }

    // =========================================================
    // USER SEEDING
    // =========================================================

    private User createOrGetUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            String email,
            String name,
            String phone,
            String password,
            Role role) {

        return userRepository.findByEmail(email)
                .map(existingUser -> {

                    /*
                     * Keep the existing password.
                     *
                     * This prevents the application from unexpectedly
                     * changing passwords every time Spring Boot starts.
                     */
                    existingUser.setName(name);
                    existingUser.setPhone(phone);
                    existingUser.setRole(role);
                    existingUser.setActive(true);

                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {

                    User user = new User();

                    user.setName(name);
                    user.setEmail(email);
                    user.setPhone(phone);
                    user.setPassword(
                            passwordEncoder.encode(password)
                    );
                    user.setRole(role);
                    user.setActive(true);

                    return userRepository.save(user);
                });
    }

    // =========================================================
    // RESTAURANT SEEDING
    // =========================================================

    private Restaurant createOrUpdateRestaurant(
            RestaurantRepository restaurantRepository,
            User owner,
            String name,
            String description,
            String address,
            String phone,
            String cuisine,
            double rating,
            int deliveryTime,
            double priceForTwo,
            String imageUrl,
            boolean approved,
            boolean active) {

        /*
         * IMPORTANT:
         *
         * Find by restaurant name first.
         *
         * This prevents a second restaurant belonging to the same owner
         * from accidentally overwriting the owner's existing restaurant.
         */
        Restaurant restaurant = findRestaurantByExactName(
                restaurantRepository,
                name
        );

        if (restaurant == null) {
            restaurant = new Restaurant();
            restaurant.setOwnerId(owner.getId());
            restaurant.setCreatedAt(LocalDateTime.now());
        }

        restaurant.setName(name);
        restaurant.setDescription(description);
        restaurant.setOwnerId(owner.getId());
        restaurant.setAddress(address);
        restaurant.setPhone(phone);
        restaurant.setCuisine(cuisine);
        restaurant.setRating(rating);
        restaurant.setDeliveryTime(deliveryTime);
        restaurant.setPriceForTwo(priceForTwo);
        restaurant.setImageUrl(imageUrl);
        restaurant.setApproved(approved);
        restaurant.setActive(active);

        return restaurantRepository.save(restaurant);
    }

    // =========================================================
    // NIYAS KITCHEN MIGRATION
    // =========================================================

    private Restaurant createOrUpdateNiyasKitchen(
            RestaurantRepository restaurantRepository,
            User owner) {

        /*
         * First check whether the migration has already happened.
         */
        Restaurant restaurant = findRestaurantByExactName(
                restaurantRepository,
                "Niyas Kitchen"
        );

        /*
         * If not, find the existing "Niyas" restaurant from your
         * original project data and rename that same database record.
         */
        if (restaurant == null) {
            restaurant = findRestaurantByExactName(
                    restaurantRepository,
                    "Niyas"
            );
        }

        /*
         * If neither exists, create a fresh record.
         */
        if (restaurant == null) {
            restaurant = new Restaurant();
            restaurant.setCreatedAt(LocalDateTime.now());
        }

        restaurant.setOwnerId(owner.getId());
        restaurant.setName("Niyas Kitchen");
        restaurant.setDescription(
                "A welcoming Indian kitchen serving comforting rice dishes, biryanis, snacks and everyday favourites."
        );
        restaurant.setAddress("43A, Main Road, Thittuvelai");
        restaurant.setPhone("7345689071");
        restaurant.setCuisine("Indian");

        /*
         * No artificial rating.
         * The frontend will hide the rating until real rating data exists.
         */
        restaurant.setRating(0.0);

        restaurant.setDeliveryTime(30);
        restaurant.setPriceForTwo(250);
        restaurant.setImageUrl("");
        restaurant.setApproved(true);
        restaurant.setActive(true);

        return restaurantRepository.save(restaurant);
    }

    private Restaurant findRestaurantByExactName(
            RestaurantRepository restaurantRepository,
            String name) {

        List<Restaurant> restaurants =
                restaurantRepository.findByNameContainingIgnoreCase(name);

        for (Restaurant restaurant : restaurants) {
            if (restaurant.getName() != null
                    && restaurant.getName().equalsIgnoreCase(name)) {
                return restaurant;
            }
        }

        return null;
    }

    // =========================================================
    // SPICE ROUTE KITCHEN
    // =========================================================

    private void seedSpiceRoute(
            CategoryRepository categoryRepository,
            FoodRepository foodRepository,
            Restaurant restaurant) {

        Category starters = createCategory(
                categoryRepository,
                restaurant,
                "Starters",
                "Tandoor favourites and Indian appetisers"
        );

        Category biryani = createCategory(
                categoryRepository,
                restaurant,
                "Biryani",
                "Aromatic rice dishes prepared with fragrant spices"
        );

        Category mainCourse = createCategory(
                categoryRepository,
                restaurant,
                "Main Course",
                "Rich curries and traditional Indian favourites"
        );

        Category breads = createCategory(
                categoryRepository,
                restaurant,
                "Indian Breads",
                "Freshly baked breads from the tandoor"
        );

        Category desserts = createCategory(
                categoryRepository,
                restaurant,
                "Desserts",
                "Classic Indian sweets and desserts"
        );

        Category beverages = createCategory(
                categoryRepository,
                restaurant,
                "Beverages",
                "Refreshing drinks and traditional favourites"
        );

        createFood(
                foodRepository, restaurant, starters,
                "Chicken 65",
                "Crispy South Indian style fried chicken tossed with curry leaves and spices.",
                "220",
                "https://images.unsplash.com/photo-1658249499954-4aad343157f9",
                false, 4.6, 18
        );

        createFood(
                foodRepository, restaurant, starters,
                "Paneer Tikka",
                "Char-grilled paneer with peppers, onions and smoky tandoori spices.",
                "210",
                "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8",
                true, 4.5, 20
        );

        createFood(
                foodRepository, restaurant, biryani,
                "Chicken Biryani",
                "Fragrant basmati rice layered with tender chicken, saffron and aromatic spices.",
                "280",
                "https://images.pexels.com/photos/33947401/pexels-photo-33947401.jpeg",
                false, 4.8, 30
        );

        createFood(
                foodRepository, restaurant, biryani,
                "Paneer Biryani",
                "Aromatic basmati rice cooked with paneer, vegetables and fragrant Indian spices.",
                "240",
                "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
                true, 4.5, 28
        );

        createFood(
                foodRepository, restaurant, mainCourse,
                "Butter Chicken",
                "Tender chicken simmered in a creamy tomato and butter gravy.",
                "290",
                "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
                false, 4.7, 25
        );

        createFood(
                foodRepository, restaurant, mainCourse,
                "Paneer Butter Masala",
                "Soft paneer cooked in a rich tomato, butter and cream gravy.",
                "240",
                "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
                true, 4.6, 22
        );

        createFood(
                foodRepository, restaurant, breads,
                "Butter Naan",
                "Soft tandoor-baked naan brushed with melted butter.",
                "55",
                "https://images.pexels.com/photos/37182517/pexels-photo-37182517.jpeg",
                true, 4.5, 8
        );

        createFood(
                foodRepository, restaurant, breads,
                "Garlic Naan",
                "Tandoor-baked naan topped with garlic, coriander and butter.",
                "70",
                "https://images.pexels.com/photos/35066813/pexels-photo-35066813.jpeg",
                true, 4.7, 8
        );

        createFood(
                foodRepository, restaurant, desserts,
                "Gulab Jamun",
                "Soft milk-solid dumplings soaked in warm cardamom sugar syrup.",
                "90",
                "https://images.pexels.com/photos/11887844/pexels-photo-11887844.jpeg",
                true, 4.6, 5
        );

        createFood(
                foodRepository, restaurant, beverages,
                "Masala Chai",
                "Indian milk tea brewed with cardamom, ginger and warming spices.",
                "60",
                "https://images.unsplash.com/photo-1571934811356-5cc061b6821f",
                true, 4.5, 6
        );
    }

    // =========================================================
    // GREEN LEAF BISTRO
    // =========================================================

    private void seedGreenLeaf(
            CategoryRepository categoryRepository,
            FoodRepository foodRepository,
            Restaurant restaurant) {

        Category southIndian = createCategory(
                categoryRepository, restaurant,
                "South Indian",
                "Freshly prepared dosa, idli and traditional breakfast favourites"
        );

        Category riceMeals = createCategory(
                categoryRepository, restaurant,
                "Rice & Meals",
                "Comforting rice dishes and wholesome vegetarian meals"
        );

        Category paneer = createCategory(
                categoryRepository, restaurant,
                "Paneer Specials",
                "Vegetarian favourites featuring fresh paneer"
        );

        Category snacks = createCategory(
                categoryRepository, restaurant,
                "Snacks",
                "Light bites for any time of day"
        );

        Category desserts = createCategory(
                categoryRepository, restaurant,
                "Desserts",
                "Sweet treats to finish your meal"
        );

        Category beverages = createCategory(
                categoryRepository, restaurant,
                "Beverages",
                "Fresh juices, coffee and refreshing drinks"
        );

        createFood(
                foodRepository, restaurant, southIndian,
                "Masala Dosa",
                "Crispy rice crepe filled with seasoned potato masala, served with chutney and sambar.",
                "140",
                "https://images.unsplash.com/photo-1668236543090-82eba5ee5976",
                true, 4.7, 15
        );

        createFood(
                foodRepository, restaurant, southIndian,
                "Idli Sambar",
                "Soft steamed idlis served with hot sambar and fresh coconut chutney.",
                "100",
                "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
                true, 4.5, 10
        );

        createFood(
                foodRepository, restaurant, southIndian,
                "Medu Vada",
                "Crispy lentil fritters served with sambar and coconut chutney.",
                "110",
                "https://images.pexels.com/photos/37421009/pexels-photo-37421009.jpeg",
                true, 4.5, 12
        );

        createFood(
                foodRepository, restaurant, riceMeals,
                "Vegetable Biryani",
                "Fragrant basmati rice cooked with seasonal vegetables and aromatic spices.",
                "190",
                "https://images.pexels.com/photos/35041655/pexels-photo-35041655.jpeg",
                true, 4.5, 25
        );

        createFood(
                foodRepository, restaurant, riceMeals,
                "South Indian Meals",
                "A wholesome vegetarian meal with rice, sambar, rasam, vegetables and accompaniments.",
                "220",
                "https://images.pexels.com/photos/14132112/pexels-photo-14132112.jpeg",
                true, 4.6, 20
        );

        createFood(
                foodRepository, restaurant, paneer,
                "Paneer Tikka",
                "Char-grilled paneer marinated in yogurt and aromatic spices.",
                "210",
                "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8",
                true, 4.6, 20
        );

        createFood(
                foodRepository, restaurant, paneer,
                "Paneer Rice Bowl",
                "Seasoned rice topped with grilled paneer, vegetables and house sauce.",
                "230",
                "https://images.unsplash.com/photo-1512058564366-18510be2db19",
                true, 4.4, 18
        );

        createFood(
                foodRepository, restaurant, snacks,
                "Samosa",
                "Crispy pastry filled with spiced potatoes and peas.",
                "80",
                "https://images.unsplash.com/photo-1601050690597-df0568f70950",
                true, 4.5, 10
        );

        createFood(
                foodRepository, restaurant, desserts,
                "Gajar Halwa",
                "Slow-cooked carrot pudding finished with nuts and aromatic spices.",
                "120",
                "https://images.pexels.com/photos/35532835/pexels-photo-35532835.jpeg",
                true, 4.4, 8
        );

        createFood(
                foodRepository, restaurant, beverages,
                "Filter Coffee",
                "Traditional South Indian filter coffee with rich milk and roasted coffee.",
                "70",
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
                true, 4.7, 5
        );
    }

    // =========================================================
    // URBAN WOK HOUSE
    // =========================================================

    private void seedUrbanWok(
            CategoryRepository categoryRepository,
            FoodRepository foodRepository,
            Restaurant restaurant) {

        Category starters = createCategory(
                categoryRepository, restaurant,
                "Starters",
                "Crispy and spicy Asian-inspired appetisers"
        );

        Category noodles = createCategory(
                categoryRepository, restaurant,
                "Noodles",
                "Wok-tossed noodles prepared to order"
        );

        Category friedRice = createCategory(
                categoryRepository, restaurant,
                "Fried Rice",
                "Fragrant rice tossed with vegetables and bold sauces"
        );

        Category momos = createCategory(
                categoryRepository, restaurant,
                "Momos",
                "Steamed and pan-fried dumplings with house sauces"
        );

        Category mainCourse = createCategory(
                categoryRepository, restaurant,
                "Main Course",
                "Popular Indo-Chinese favourites"
        );

        Category beverages = createCategory(
                categoryRepository, restaurant,
                "Beverages",
                "Refreshing drinks to pair with your meal"
        );

        createFood(
                foodRepository, restaurant, starters,
                "Chilli Paneer",
                "Crispy paneer tossed with peppers, onions and a spicy chilli sauce.",
                "210",
                "https://images.pexels.com/photos/29631468/pexels-photo-29631468.jpeg",
                true, 4.5, 18
        );

        createFood(
                foodRepository, restaurant, starters,
                "Spring Rolls",
                "Crispy rolls filled with seasoned vegetables and served with chilli sauce.",
                "150",
                "https://images.pexels.com/photos/9328496/pexels-photo-9328496.jpeg",
                true, 4.4, 15
        );

        createFood(
                foodRepository, restaurant, noodles,
                "Chicken Hakka Noodles",
                "Wok-tossed noodles with chicken, vegetables and savoury Asian sauces.",
                "240",
                "https://images.pexels.com/photos/34170981/pexels-photo-34170981.jpeg",
                false, 4.6, 18
        );

        createFood(
                foodRepository, restaurant, noodles,
                "Vegetable Hakka Noodles",
                "Classic wok-tossed noodles with crunchy vegetables and house seasoning.",
                "190",
                "https://images.pexels.com/photos/2764905/pexels-photo-2764905.jpeg",
                true, 4.4, 16
        );

        createFood(
                foodRepository, restaurant, friedRice,
                "Chicken Fried Rice",
                "Wok-fried rice with tender chicken, vegetables, spring onions and soy.",
                "230",
                "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
                false, 4.6, 18
        );

        createFood(
                foodRepository, restaurant, friedRice,
                "Schezwan Fried Rice",
                "Spicy wok-fried rice with vegetables and bold Schezwan chilli sauce.",
                "210",
                "https://images.pexels.com/photos/33947401/pexels-photo-33947401.jpeg",

                true, 4.5, 18
        );

        createFood(
                foodRepository, restaurant, momos,
                "Chicken Momos",
                "Steamed dumplings filled with seasoned chicken and served with chilli dip.",
                "180",
                "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9",
                false, 4.6, 15
        );

        createFood(
                foodRepository, restaurant, momos,
                "Vegetable Momos",
                "Steamed dumplings filled with seasoned vegetables and house chilli sauce.",
                "160",
                "https://images.pexels.com/photos/28445587/pexels-photo-28445587.jpeg",
                true, 4.5, 15
        );

        createFood(
                foodRepository, restaurant, mainCourse,
                "Chicken Manchurian",
                "Crispy chicken tossed in a glossy Manchurian sauce with spring onions.",
                "260",
                "https://images.pexels.com/photos/29631426/pexels-photo-29631426.jpeg",
                false, 4.5, 20
        );

        createFood(
                foodRepository, restaurant, mainCourse,
                "Veg Manchurian",
                "Crispy vegetable dumplings coated in a savoury Manchurian sauce.",
                "220",
                "https://images.pexels.com/photos/29631489/pexels-photo-29631489.jpeg",
                true, 4.4, 18
        );

        createFood(
                foodRepository, restaurant, beverages,
                "Fresh Lime Soda",
                "Refreshing lime soda served sweet or salted.",
                "90",
                "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd",
                true, 4.5, 5
        );
    }

    // =========================================================
// NIYAS KITCHEN
// =========================================================

    private void seedNiyasKitchen(
            CategoryRepository categoryRepository,
            FoodRepository foodRepository,
            Restaurant restaurant) {

        Category biryani = createCategory(
                categoryRepository, restaurant,
                "Biryani",
                "Comforting rice dishes prepared with aromatic spices"
        );

        Category mainCourse = createCategory(
                categoryRepository, restaurant,
                "Main Course",
                "Homestyle Indian curries and rice favourites"
        );

        Category breads = createCategory(
                categoryRepository, restaurant,
                "Indian Breads",
                "Fresh breads to pair with curries"
        );

        Category snacks = createCategory(
                categoryRepository, restaurant,
                "Snacks",
                "Crispy Indian snacks and quick bites"
        );

        Category desserts = createCategory(
                categoryRepository, restaurant,
                "Desserts",
                "Traditional sweet treats"
        );

        Category beverages = createCategory(
                categoryRepository, restaurant,
                "Beverages",
                "Refreshing Indian drinks"
        );

        createFood(
                foodRepository, restaurant, biryani,
                "Chicken Biryani",
                "Fragrant basmati rice layered with tender chicken and aromatic spices.",
                "220",
                "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a",
                false, 0.0, 28
        );

        createFood(
                foodRepository, restaurant, biryani,
                "Veg Biryani",
                "Aromatic basmati rice cooked with vegetables and traditional spices.",
                "180",
                // Veg Biryani
                "https://images.pexels.com/photos/35041655/pexels-photo-35041655.jpeg",
                true, 0.0, 25
        );

        createFood(
                foodRepository, restaurant, mainCourse,
                "Chicken Curry",
                "Tender chicken cooked in a traditional onion, tomato and spice gravy.",
                "210",
                "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
                false, 0.0, 22
        );

        createFood(
                foodRepository, restaurant, mainCourse,
                "Paneer Masala",
                "Soft paneer cooked in a rich Indian tomato and onion gravy.",
                "190",
                "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
                true, 0.0, 20
        );

        createFood(
                foodRepository, restaurant, breads,
                "Butter Naan",
                "Soft tandoor-baked naan finished with butter.",
                "50",
                "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7",
                true, 0.0, 8
        );

        createFood(
                foodRepository, restaurant, breads,
                "Chapati",
                "Soft whole-wheat Indian flatbread.",
                "35",
                // Chapati
                "https://images.pexels.com/photos/5589943/pexels-photo-5589943.jpeg",
                true, 0.0, 7
        );

        createFood(
                foodRepository, restaurant, snacks,
                "Samosa",
                "Crispy pastry filled with spiced potato and peas.",
                "60",
                "https://images.unsplash.com/photo-1601050690597-df0568f70950",
                true, 0.0, 10
        );

        createFood(
                foodRepository, restaurant, snacks,
                "Chicken 65",
                "Crispy fried chicken tossed with South Indian spices and curry leaves.",
                "180",
                "https://images.unsplash.com/photo-1658249499954-4aad343157f9",
                false, 0.0, 15
        );

        createFood(
                foodRepository, restaurant, desserts,
                "Gulab Jamun",
                "Soft milk-solid dumplings soaked in cardamom sugar syrup.",
                "80",
                // Gulab Jamun
                "https://images.pexels.com/photos/11887844/pexels-photo-11887844.jpeg",
                true, 0.0, 5
        );

        createFood(
                foodRepository, restaurant, beverages,
                "Masala Chai",
                "Indian milk tea brewed with ginger and aromatic spices.",
                "50",
                "https://images.unsplash.com/photo-1571934811356-5cc061b6821f",
                true, 0.0, 5
        );
    }

    // =========================================================
    // DESERT FLAME
    // =========================================================

    private void seedDesertFlame(
            CategoryRepository categoryRepository,
            FoodRepository foodRepository,
            Restaurant restaurant) {

        Category grills = createCategory(
                categoryRepository, restaurant,
                "Grills & Kebabs",
                "Smoky grilled meats and Arabian-style kebabs"
        );

        Category rice = createCategory(
                categoryRepository, restaurant,
                "Rice Platters",
                "Fragrant rice served with grilled favourites"
        );

        Category wraps = createCategory(
                categoryRepository, restaurant,
                "Wraps",
                "Loaded Arabian wraps and rolls"
        );

        Category starters = createCategory(
                categoryRepository, restaurant,
                "Starters",
                "Middle Eastern appetisers and sharing plates"
        );

        Category desserts = createCategory(
                categoryRepository, restaurant,
                "Desserts",
                "Sweet Arabian-inspired treats"
        );

        Category beverages = createCategory(
                categoryRepository, restaurant,
                "Beverages",
                "Refreshing drinks and coolers"
        );

        createFood(
                foodRepository, restaurant, grills,
                "Chicken Shish Kebab",
                "Tender marinated chicken grilled with peppers and aromatic Arabian spices.",
                "280",
                "https://images.pexels.com/photos/31648205/pexels-photo-31648205.jpeg",
                false, 0.0, 25
        );

        createFood(
                foodRepository, restaurant, grills,
                "Chicken Tikka",
                "Char-grilled chicken pieces marinated in yogurt and fragrant spices.",
                "260",
                "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0",
                false, 0.0, 22
        );

        createFood(
                foodRepository, restaurant, rice,
                "Chicken Mandi",
                "Fragrant Arabian rice served with tender roasted chicken and house spices.",
                "320",
                "https://images.pexels.com/photos/18698228/pexels-photo-18698228.jpeg",
                false, 0.0, 30
        );

        createFood(
                foodRepository, restaurant, rice,
                "Mutton Mandi",
                "Aromatic mandi rice served with tender slow-cooked mutton.",
                "390",
                "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
                false, 0.0, 35
        );

        createFood(
                foodRepository, restaurant, wraps,
                "Chicken Shawarma",
                "Juicy chicken, fresh vegetables and garlic sauce wrapped in warm flatbread.",
                "180",
                "https://images.unsplash.com/photo-1529006557810-274b9b2fc783",
                false, 0.0, 15
        );

        createFood(
                foodRepository, restaurant, wraps,
                "Paneer Shawarma",
                "Grilled paneer with vegetables and creamy garlic sauce in warm flatbread.",
                "170",
                "https://images.pexels.com/photos/29173093/pexels-photo-29173093.jpeg",
                true, 0.0, 15
        );

        createFood(
                foodRepository, restaurant, starters,
                "Hummus & Pita",
                "Creamy chickpea hummus served with warm pita bread.",
                "150",
                "https://images.pexels.com/photos/11842140/pexels-photo-11842140.jpeg",
                true, 0.0, 10
        );

        createFood(
                foodRepository, restaurant, starters,
                "Falafel Plate",
                "Crispy chickpea falafel served with fresh salad and tahini.",
                "160",
                "https://images.pexels.com/photos/14883756/pexels-photo-14883756.jpeg",
                true, 0.0, 15
        );

        createFood(
                foodRepository, restaurant, desserts,
                "Baklava",
                "Crisp pastry layered with nuts and sweet syrup.",
                "120",
                "https://images.pexels.com/photos/8696281/pexels-photo-8696281.jpeg",
                true, 0.0, 8
        );

        createFood(
                foodRepository, restaurant, beverages,
                "Mint Lemonade",
                "Fresh lemon drink blended with mint and served chilled.",
                "110",
                "https://images.pexels.com/photos/11009199/pexels-photo-11009199.jpeg",
                true, 0.0, 5
        );
    }

    // =========================================================
    // STACK & GRILL
    // =========================================================

    private void seedStackAndGrill(
            CategoryRepository categoryRepository,
            FoodRepository foodRepository,
            Restaurant restaurant) {

        Category burgers = createCategory(
                categoryRepository, restaurant,
                "Burgers",
                "Loaded burgers made with fresh ingredients"
        );

        Category chicken = createCategory(
                categoryRepository, restaurant,
                "Chicken",
                "Crispy and grilled chicken favourites"
        );

        Category sides = createCategory(
                categoryRepository, restaurant,
                "Sides",
                "Crispy sides and sharing bites"
        );

        Category sandwiches = createCategory(
                categoryRepository, restaurant,
                "Sandwiches",
                "Toasted sandwiches packed with flavour"
        );

        Category desserts = createCategory(
                categoryRepository, restaurant,
                "Desserts",
                "Sweet treats to finish your meal"
        );

        Category beverages = createCategory(
                categoryRepository, restaurant,
                "Beverages",
                "Refreshing drinks and coolers"
        );

        createFood(
                foodRepository, restaurant, burgers,
                "Classic Chicken Burger",
                "Crispy chicken fillet with lettuce, tomato and house sauce.",
                "220",
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
                false, 0.0, 18
        );

        createFood(
                foodRepository, restaurant, burgers,
                "Classic Veg Burger",
                "Crispy vegetable patty layered with fresh lettuce, tomato and sauce.",
                "180",
                "https://images.unsplash.com/photo-1520072959219-c595dc870360",
                true, 0.0, 18
        );

        createFood(
                foodRepository, restaurant, burgers,
                "Double Cheese Burger",
                "Double stacked beef-free grilled patties with melted cheese and house sauce.",
                "260",
                "https://images.unsplash.com/photo-1550547660-d9450f859349",
                false, 0.0, 20
        );

        createFood(
                foodRepository, restaurant, chicken,
                "Crispy Chicken Strips",
                "Golden fried chicken strips served with creamy dipping sauce.",
                "210",
                "https://images.unsplash.com/photo-1562967914-608f82629710",
                false, 0.0, 16
        );

        createFood(
                foodRepository, restaurant, chicken,
                "Grilled Chicken Plate",
                "Juicy grilled chicken served with fresh salad and house dressing.",
                "280",
                "https://images.unsplash.com/photo-1532550907401-a500c9a57435",
                false, 0.0, 22
        );

        createFood(
                foodRepository, restaurant, sides,
                "French Fries",
                "Crispy golden fries lightly seasoned with salt.",
                "100",
                "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
                true, 0.0, 10
        );

        createFood(
                foodRepository, restaurant, sides,
                "Loaded Cheese Fries",
                "Crispy fries topped with creamy cheese sauce and herbs.",
                "150",
                "https://images.pexels.com/photos/29285460/pexels-photo-29285460.jpeg",
                true, 0.0, 12
        );

        createFood(
                foodRepository, restaurant, sandwiches,
                "Grilled Chicken Sandwich",
                "Toasted bread filled with grilled chicken, vegetables and creamy sauce.",
                "210",
                "https://images.unsplash.com/photo-1553909489-cd47e0907980",
                false, 0.0, 15
        );

        createFood(
                foodRepository, restaurant, desserts,
                "Chocolate Brownie",
                "Warm chocolate brownie with a rich fudgy centre.",
                "130",
                "https://images.pexels.com/photos/37148593/pexels-photo-37148593.jpeg",
                true, 0.0, 8
        );

        createFood(
                foodRepository, restaurant, beverages,
                "Classic Lemonade",
                "Freshly prepared lemonade served chilled.",
                "90",
                "https://images.pexels.com/photos/11070660/pexels-photo-11070660.jpeg",
                true, 0.0, 5
        );
    }

    // =========================================================
    // CATEGORY HELPER
    // =========================================================

    private Category createCategory(
            CategoryRepository categoryRepository,
            Restaurant restaurant,
            String name,
            String description) {

        List<Category> existingCategories =
                categoryRepository.findByRestaurantId(
                        restaurant.getId()
                );

        for (Category existing : existingCategories) {

            if (existing.getName().equalsIgnoreCase(name)) {

                existing.setDescription(description);
                existing.setActive(true);

                return categoryRepository.save(existing);
            }
        }

        Category category = new Category();

        category.setRestaurantId(restaurant.getId());
        category.setName(name);
        category.setDescription(description);
        category.setActive(true);
        category.setCreatedAt(LocalDateTime.now());

        return categoryRepository.save(category);
    }

    // =========================================================
    // FOOD HELPER
    // =========================================================

    private FoodItem createFood(
            FoodRepository foodRepository,
            Restaurant restaurant,
            Category category,
            String name,
            String description,
            String price,
            String imageUrl,
            boolean isVeg,
            double rating,
            int preparationTime) {

        List<FoodItem> existingFoods =
                foodRepository.findByRestaurantId(
                        restaurant.getId()
                );

        for (FoodItem existing : existingFoods) {

            if (existing.getName().equalsIgnoreCase(name)) {

                existing.setCategoryId(category.getId());
                existing.setDescription(description);
                existing.setPrice(new BigDecimal(price));
                existing.setImageUrl(imageUrl);
                existing.setVeg(isVeg);
                existing.setRating(rating);
                existing.setPreparationTime(preparationTime);
                existing.setAvailable(true);

                return foodRepository.save(existing);
            }
        }

        FoodItem food = new FoodItem();

        food.setRestaurantId(restaurant.getId());
        food.setCategoryId(category.getId());
        food.setName(name);
        food.setDescription(description);
        food.setPrice(new BigDecimal(price));
        food.setImageUrl(imageUrl);
        food.setVeg(isVeg);
        food.setRating(rating);
        food.setPreparationTime(preparationTime);
        food.setAvailable(true);
        food.setCreatedAt(LocalDateTime.now());

        return foodRepository.save(food);
    }
}