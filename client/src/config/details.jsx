import {
  Award,
  Zap,
  Percent,
  Gift,
  SortAsc,
  Filter,
  Search,
  Star,
  SortDesc,
} from "lucide-react";
import { FaSortAmountUp, FaSortNumericDownAlt, FaSortNumericUpAlt } from "react-icons/fa";


export const categories = [
  {
    id: 1,
    name: "Pizza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3",
    description:
      "Delicious pizza with a crispy crust and a generous amount of cheese.",
    price: "$10",
    rating: 4.5,
    reviews: 100,
    discount: 20,
    brand: "Pizza Hut",
  },
  {
    id: 2,
    name: "Pasta",
    image:
      "https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-4.0.3",
    description:
      "Delicious pasta with a creamy sauce and a generous amount of cheese.",
    price: "$10",
    rating: 4.5,
    reviews: 100,
    discount: 20,
    brand: "Pasta Hut",
  },
  {
    id: 3,
    name: "Chinese",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-4.0.3",
    description:
      "Delicious chinese food with a creamy sauce and a generous amount of cheese.",
    price: "$10",
    rating: 4.5,
    reviews: 100,
    discount: 20,
    brand: "Xiao Long Bao",
  },
  {
    id: 4,
    name: "Burgers",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3",
    description:
      "Delicious burgers with a creamy sauce and a generous amount of cheese.",
    price: "$10",
    rating: 4.5,
    reviews: 100,
    discount: 20,
    brand: "Burger King",
  },
  {
    id: 5,
    name: "Sushi",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3",
    description:
      "Delicious sushi with a creamy sauce and a generous amount of cheese.",
    price: "$10",
    rating: 4.5,
    reviews: 100,
    discount: 20,
    brand: "Sushi King",
  },
  {
    id: 6,
    name: "Desserts",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3",
    description:
      "Delicious desserts with a creamy sauce and a generous amount of cheese.",
    price: "$10",
    rating: 4.5,
    reviews: 100,
    discount: 20,
    brand: "Creamy Cream",
  },
  {
    id: 7,
    name: "Indian",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3",
    description:
      "Delicious indian food with a creamy sauce and a generous amount of cheese.",
    price: "$10",
    rating: 4.5,
    reviews: 100,
    discount: 20,
    brand: "Adadab",
  },
  {
    id: 8,
    name: "Mexican",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3",
    description:
      "Delicious mexican food with a creamy sauce and a generous amount of cheese.",
    price: "$10",
    rating: 4.5,
    reviews: 100,
    discount: 20,
    brand: "Chilli's Grill",
  },
  {
    id: 9,
    name: "Thai",
    image:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3",
    description:
      "Delicious thai food with a creamy sauce and a generous amount of cheese.",
    price: "$10",
    rating: 4.5,
    reviews: 100,
    discount: 20,
    brand: "Dara's Kitchen",
  },
  {
    id: 10,
    name: "Mediterranean",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3",
    description:
      "Delicious mediterranean food with a creamy sauce and a generous amount of cheese.",
    price: "$10",
    rating: 4.5,
    reviews: 100,
    discount: 20,
    brand: "Zest",
  },
];

export const bestSellers = [
  {
    id: 1,
    name: "Cheeseburger",
    image:
      "https://images.unsplash.com/photo-1601002022020-1c1c1c1c1c1c?ixlib=rb-4.0.3",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    image:
      "https://images.unsplash.com/photo-1601002022020-2c2c2c2c2c2c?ixlib=rb-4.0.3",
  },
  {
    id: 3,
    name: "Pasta Carbonara",
    image:
      "https://images.unsplash.com/photo-1601002022020-3c3c3c3c3c3c?ixlib=rb-4.0.3",
  },
  {
    id: 4,
    name: "Sushi Platter",
    image:
      "https://images.unsplash.com/photo-1601002022020-4c4c4c4c4c4c?ixlib=rb-4.0.3",
  },
];

export const specialOffers = [
  {
    id: "new-user",
    title: "Welcome Offer",
    description: "20% OFF Your First Order",
    code: "WELCOME20",
    icon: <Gift className="h-6 w-6 text-red-500" />,
    expiryTime: {
      hours: "05",
      minutes: "59",
      seconds: "59",
    },
    gradient: "from-red-500 to-orange-500",
    additionalInfo: "Valid for orders above $15",
    target: "New users only",
  },
  {
    id: "free-delivery",
    title: "Free Delivery",
    description: "No Delivery Fee on Orders $25+",
    code: "FREEDEL",
    icon: <Zap className="h-6 w-6 text-purple-500" />,
    expiryTime: {
      hours: "11",
      minutes: "22",
      seconds: "33",
    },
    gradient: "from-purple-500 to-pink-500",
    additionalInfo: "Limited to 5km radius",
    target: "All users",
  },
  {
    id: "weekend-special",
    title: "Weekend Special",
    description: "15% OFF on Selected Restaurants",
    code: "WEEKEND15",
    icon: <Percent className="h-6 w-6 text-blue-500" />,
    expiryTime: {
      hours: "48",
      minutes: "00",
      seconds: "00",
    },
    gradient: "from-blue-500 to-cyan-500",
    additionalInfo: "Valid Sat-Sun only",
    target: "All users",
  },
  {
    id: "loyalty-reward",
    title: "Loyalty Reward",
    description: "10% OFF Every 5th Order",
    code: "LOYAL10",
    icon: <Award className="h-6 w-6 text-green-500" />,
    expiryTime: {
      hours: "00",
      minutes: "00",
      seconds: "00",
    }, // Permanent offer
    gradient: "from-green-500 to-teal-500",
    additionalInfo: "Automatically applied at checkout",
    target: "Registered users",
  },
];

export const testimonials = [
  {
    id: 1,
    quote: "The food was absolutely amazing! Highly recommend!",
    name: "John Doe",
    rating: 5,
    foodItem: "Cheeseburger",
  },
  {
    id: 2,
    quote: "Best pizza I've ever had! Will order again.",
    name: "Jane Smith",
    rating: 5,
    foodItem: "Margherita Pizza",
  },
  {
    id: 3,
    quote: "Quick delivery and delicious food. Very satisfied!",
    name: "Alice Johnson",
    rating: 4,
    foodItem: "Pasta Carbonara",
  },
  {
    id: 4,
    quote: "Great service and the sushi was fresh and tasty!",
    name: "Bob Brown",
    rating: 5,
    foodItem: "Sushi Platter",
  },
  {
    id: 5,
    quote: "The food was absolutely amazing! Highly recommend!",
    name: "John Doe",
    rating: 5,
    foodItem: "Cheeseburger",
  },
  {
    id: 6,
    quote: "The food was absolutely amazing! Highly recommend!",
    name: "John Doe",
    rating: 5,
    foodItem: "Cheeseburger",
  },
  {
    id: 7,
    quote: "The food was absolutely amazing! Highly recommend!",
    name: "John Doe",
    rating: 5,
    foodItem: "Cheeseburger",
  },
  {
    id: 8,
    quote: "The food was absolutely amazing! Highly recommend!",
    name: "John Doe",
    rating: 5,
    foodItem: "Cheeseburger",
  },
];

export const contactDetails = [
  {
    id: 1,
    title: "Contact Information",
    details: [
      "123 Food Street, Flavor Town, USA",
      "Phone: (123) 456-7890",
      "Email: contact@bitebox.com",
    ],
  },
  {
    id: 2,
    title: "Business Hours",
    details: [
      "Monday - Friday: 9am - 8pm",
      "Saturday: 10am - 6pm",
      "Sunday: Closed",
    ],
  },
  {
    id: 3,
    title: "Follow Us",
    details: ["Facebook", "Twitter", "Instagram"],
  },
];

export const filterButtons = [
  {
    id: 1,
    name: "A-Z",
    icon: <SortAsc className="h-6 w-6 text-gray-500" />,
  },
  {
    id: 2,
    name: "Z-A",
    icon: <SortDesc className="h-6 w-6 text-gray-500" />,
  },
  {
    id: 3,
    name: "Price (High to Low)",
    icon: <FaSortNumericUpAlt className="h-6 w-6 text-gray-500" />,
  },
  {
    id: 4,
    name: "Price (Low to High)",
    icon: <FaSortNumericDownAlt className="h-6 w-6 text-gray-500" />,
  },
  {
    id: 5,
    name: "Search",
    icon: <Search className="h-6 w-6 text-gray-500" />,
  },
  {
    id: 6,
    name: "Best Sellers",
    icon: <Star className="h-6 w-6 text-gray-500" />,
  },
  {
    id: 7,
    name: "Pure Veg",
    icon: <Star className="h-6 w-6 text-gray-500" />,
  },
  {
    id: 8,
    name: "Non Veg",
    icon: <Star className="h-6 w-6 text-gray-500" />,
  },
];
