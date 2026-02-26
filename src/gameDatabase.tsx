import { 
  Leaf, 
  History as HistoryIcon, 
  Calculator, 
  FlaskConical, 
  Globe2,
  Palette,
  Music,
  Dumbbell,
  Utensils,
  Heart,
  BookOpen
} from 'lucide-react';

export const TIMER_DURATION = 15; // seconds

// Curated Game Database with verified working images - 80+ questions
export const DB = {
  Animals: {
    color: "bg-rose-500",
    icon: <Heart className="w-4 h-4" />,
    items: [
      { name: "lion", hint: "My roar echoes through the savanna, and a crown of gold frames my face.", img: "https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "elephant", hint: "I never forget, and my nose can lift trees and spray water.", img: "https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "tiger", hint: "Silent hunter with burning stripes, I prowl alone in Asian forests.", img: "https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "giraffe", hint: "My purple tongue reaches the highest leaves, and my spots are unique.", img: "https://images.pexels.com/photos/802112/pexels-photo-802112.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "zebra", hint: "No two of us are identical, though we all wear nature's barcode.", img: "https://images.pexels.com/photos/750539/pexels-photo-750539.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "penguin", hint: "I waddle on ice but dance underwater in my tuxedo.", img: "https://images.pexels.com/photos/86405/penguin-funny-blue-water-86405.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "dolphin", hint: "I speak in clicks and whistles, and surf the ocean's waves for fun.", img: "https://images.pexels.com/photos/64219/dolphin-marine-mammals-water-sea-64219.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "butterfly", hint: "I was once a crawler, now I paint the air with powdered wings.", img: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "eagle", hint: "From miles high, I spot a mouse, then dive at 200 miles per hour.", img: "https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "panda", hint: "I spend 14 hours eating, yet I'm endangered despite my cuteness.", img: "https://images.pexels.com/photos/3608263/pexels-photo-3608263.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "owl", hint: "I can rotate my head 270 degrees and hunt silently at night.", img: "https://images.pexels.com/photos/86596/owl-bird-eyes-eagle-owl-86596.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "rabbit", hint: "My teeth never stop growing, and I can see nearly 360 degrees.", img: "https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "fox", hint: "I'm cunning and clever with a bushy tail and reddish fur.", img: "https://images.pexels.com/photos/2295744/pexels-photo-2295744.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "bear", hint: "I hibernate in winter and love honey from beehives.", img: "https://images.pexels.com/photos/1059823/pexels-photo-1059823.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "wolf", hint: "I hunt in packs and howl at the moon to communicate.", img: "https://images.pexels.com/photos/1054713/pexels-photo-1054713.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" }
    ]
  },
  Food: {
    color: "bg-orange-500",
    icon: <Utensils className="w-4 h-4" />,
    items: [
      { name: "pizza", hint: "Born in Naples, I'm now sliced into triangles worldwide.", img: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "burger", hint: "Two buns embrace layers of controversy about my true origin.", img: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "ice cream", hint: "I'm frozen dairy that melts your worries away, one scoop at a time.", img: "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "apple", hint: "I kept the doctor away and tempted Eve in the garden.", img: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "banana", hint: "I'm radioactive, curved, and monkeys aren't actually obsessed with me.", img: "https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "orange", hint: "I'm named after my color, or is my color named after me?", img: "https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "strawberry", hint: "I'm not a berry, and my seeds are actually on the outside.", img: "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "chocolate", hint: "Ancient currency of the Aztecs, now melts in your mouth, not your hand.", img: "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "bread", hint: "I rise with yeast and have been the staff of life for millennia.", img: "https://images.pexels.com/photos/209196/pexels-photo-209196.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "cake", hint: "Layers of celebration, often lit with wishes and blown out.", img: "https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "watermelon", hint: "I'm 92% water, green outside and red inside with black seeds.", img: "https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "grapes", hint: "I grow in clusters and can be fermented into wine.", img: "https://images.pexels.com/photos/23042/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "carrot", hint: "I'm orange, crunchy, and rabbits supposedly love me.", img: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "tomato", hint: "Botanically I'm a fruit, but legally I'm a vegetable in the US.", img: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" }
    ]
  },
  Sports: {
    color: "bg-blue-600",
    icon: <Dumbbell className="w-4 h-4" />,
    items: [
      { name: "football", hint: "The beautiful game where hands are forbidden except for one player.", img: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "basketball", hint: "Dr. Naismith invented me with a peach basket in 1891.", img: "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "tennis", hint: "Love means zero in my scoring system, and I'm played at Wimbledon.", img: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "swimming", hint: "Michael Phelps has 23 Olympic golds in my domain.", img: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "running", hint: "Usain Bolt covered 100 meters in 9.58 seconds doing this.", img: "https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "cycling", hint: "The Tour de France tests endurance over 21 stages of this.", img: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "boxing", hint: "Float like a butterfly, sting like a bee in this ring sport.", img: "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "skateboard", hint: "Tony Hawk landed the first 900 on me at the X Games.", img: "https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "volleyball", hint: "I'm hit over a net on sand or indoor courts, invented in 1895.", img: "https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "golf", hint: "I use clubs to hit a small ball into 18 holes across vast greens.", img: "https://images.pexels.com/photos/1325659/pexels-photo-1325659.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "baseball", hint: "America's pastime with nine innings, bases, and home runs.", img: "https://images.pexels.com/photos/1308713/pexels-photo-1308713.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "yoga", hint: "Ancient practice combining poses, breathing, and meditation.", img: "https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "surfing", hint: "I ride ocean waves standing on a board, born in Hawaii.", img: "https://images.pexels.com/photos/390051/surfer-wave-sunset-the-indian-ocean-390051.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "hockey", hint: "I'm played on ice with sticks, pucks, and lots of checking.", img: "https://images.pexels.com/photos/1432441/pexels-photo-1432441.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" }
    ]
  },
  Science: {
    color: "bg-violet-600",
    icon: <FlaskConical className="w-4 h-4" />,
    items: [
      { name: "sun", hint: "I'm 93 million miles away, yet my light takes only 8 minutes to reach you.", img: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "moon", hint: "I control Earth's tides and show you different faces each night.", img: "https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "volcano", hint: "I'm Earth's pressure valve, spewing molten rock from the mantle.", img: "https://images.pexels.com/photos/2259232/pexels-photo-2259232.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "rainbow", hint: "I'm light refracted through water droplets at 42 degrees.", img: "https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "lightning", hint: "I'm hotter than the sun's surface at 30,000 Kelvin.", img: "https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "microscope", hint: "Leeuwenhoek first saw bacteria through my lenses in 1676.", img: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "magnet", hint: "I align iron atoms and create invisible fields of attraction.", img: "https://images.pexels.com/photos/39369/magnet-horseshoe-red-metal-39369.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "battery", hint: "Volta stacked me in 1800, creating the first electrical current.", img: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "telescope", hint: "Galileo used me to discover Jupiter's moons in 1610.", img: "https://images.pexels.com/photos/256379/pexels-photo-256379.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "thermometer", hint: "I measure temperature using mercury or digital sensors.", img: "https://images.pexels.com/photos/1350560/pexels-photo-1350560.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "compass", hint: "I always point north using Earth's magnetic field.", img: "https://images.pexels.com/photos/1329296/pexels-photo-1329296.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "prism", hint: "I split white light into a spectrum of rainbow colors.", img: "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "atom", hint: "I'm the smallest unit of matter, with protons and electrons.", img: "https://images.pexels.com/photos/60582/newton-s-cradle-balls-sphere-action-60582.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "dna", hint: "I'm the double helix blueprint of all living organisms.", img: "https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" }
    ]
  },
  Nature: {
    color: "bg-emerald-600",
    icon: <Globe2 className="w-4 h-4" />,
    items: [
      { name: "mountain", hint: "Everest is my tallest example, formed by tectonic collision.", img: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "ocean", hint: "I cover 71% of Earth and contain 97% of its water.", img: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "forest", hint: "I'm Earth's lungs, producing oxygen through photosynthesis.", img: "https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "waterfall", hint: "Angel Falls drops 979 meters, making me the world's tallest.", img: "https://images.pexels.com/photos/2743287/pexels-photo-2743287.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "desert", hint: "I receive less than 10 inches of rain yearly, yet life persists.", img: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "flower", hint: "I'm a plant's reproductive organ, attracting pollinators with color.", img: "https://images.pexels.com/photos/1022922/pexels-photo-1022922.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "tree", hint: "I can live thousands of years, storing carbon in my rings.", img: "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "beach", hint: "I'm where waves meet sand, constantly reshaped by tides.", img: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "river", hint: "I flow from mountains to sea, carving valleys over millennia.", img: "https://images.pexels.com/photos/1562/italian-landscape-mountains-nature.jpg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "cloud", hint: "I'm water vapor condensed into visible floating masses.", img: "https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "snow", hint: "I'm frozen precipitation that blankets the ground in white.", img: "https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "lake", hint: "I'm a large body of freshwater surrounded by land.", img: "https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "island", hint: "I'm land completely surrounded by water on all sides.", img: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "canyon", hint: "I'm a deep gorge carved by rivers over millions of years.", img: "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" }
    ]
  },
  Music: {
    color: "bg-fuchsia-600",
    icon: <Music className="w-4 h-4" />,
    items: [
      { name: "guitar", hint: "Six strings vibrate to create melodies, from flamenco to rock.", img: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "piano", hint: "I have 88 keys, 52 white and 36 black, spanning 7 octaves.", img: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "drums", hint: "I'm the heartbeat of music, keeping time with percussion.", img: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "violin", hint: "Stradivarius crafted the finest versions of me in the 1700s.", img: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "microphone", hint: "I convert sound waves into electrical signals for amplification.", img: "https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "headphones", hint: "I deliver stereo sound directly to your ears, blocking the world.", img: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "trumpet", hint: "I'm a brass instrument that heralds kings and plays jazz.", img: "https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "flute", hint: "I'm a woodwind instrument played by blowing across a hole.", img: "https://images.pexels.com/photos/4088012/pexels-photo-4088012.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "saxophone", hint: "I'm a curved brass instrument invented by Adolphe Sax.", img: "https://images.pexels.com/photos/4088801/pexels-photo-4088801.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "speaker", hint: "I convert electrical signals into sound waves you can hear.", img: "https://images.pexels.com/photos/1279406/pexels-photo-1279406.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "harmonica", hint: "I'm a small wind instrument played by blowing and drawing air.", img: "https://images.pexels.com/photos/7520385/pexels-photo-7520385.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "tambourine", hint: "I'm a percussion instrument with metal jingles around a frame.", img: "https://images.pexels.com/photos/6671280/pexels-photo-6671280.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "accordion", hint: "I'm a bellows instrument with keys and buttons for folk music.", img: "https://images.pexels.com/photos/4088012/pexels-photo-4088012.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "harp", hint: "I'm a stringed instrument with 47 strings played by plucking.", img: "https://images.pexels.com/photos/4088801/pexels-photo-4088801.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" }
    ]
  },
  Education: {
    color: "bg-sky-600",
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      { name: "book", hint: "Gutenberg revolutionized me in 1440 with movable type.", img: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "pencil", hint: "I'm graphite encased in wood, erasable and timeless.", img: "https://images.pexels.com/photos/159644/art-supplies-brushes-rulers-scissors-159644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "notebook", hint: "I'm bound pages waiting to capture your thoughts and ideas.", img: "https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "backpack", hint: "I carry knowledge on your shoulders, from class to class.", img: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "globe", hint: "I'm a spherical map showing Earth's continents and oceans.", img: "https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "calculator", hint: "I perform arithmetic operations faster than your brain can think.", img: "https://images.pexels.com/photos/5238645/pexels-photo-5238645.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "ruler", hint: "I measure length precisely in inches or centimeters.", img: "https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "scissors", hint: "I have two blades that cut paper with a snipping motion.", img: "https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "eraser", hint: "I remove pencil marks by friction, leaving rubber crumbs.", img: "https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "compass", hint: "I draw perfect circles in geometry class.", img: "https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "protractor", hint: "I measure angles in degrees from 0 to 180.", img: "https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "dictionary", hint: "I define words and their meanings alphabetically.", img: "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "microscope", hint: "I magnify tiny specimens for scientific observation.", img: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" },
      { name: "chalkboard", hint: "Teachers write on me with chalk and erase with felt.", img: "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=400&h=300" }
    ]
  }
};

export type ThemeName = keyof typeof DB;
