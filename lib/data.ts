// Add import for additional data at the top of the file
import { additionalTopics, additionalQuizzes } from "./additional-data"

// Sample data for Flutter interview preparation app

// Topic data
export const topics = [
  // Junior level topics
  {
    id: "flutter-basics",
    title: "Flutter Basics",
    description: "Introduction to Flutter framework and its core concepts",
    level: "junior" as const,
    estimatedTime: 15,
    content: [
      {
        title: "What is Flutter?",
        content:
          "Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase. Flutter works with existing code, is used by developers and organizations around the world, and is free and open source.",
      },
      {
        title: "Key Features",
        content:
          "Flutter offers fast development with hot reload, expressive and flexible UI, and native performance across platforms. It uses Dart programming language which is optimized for UI development.",
      },
      {
        title: "Widget-Based Architecture",
        content:
          "Everything in Flutter is a widget. Widgets are the basic building blocks of a Flutter app's user interface. Each widget is an immutable declaration of part of the user interface.",
      },
      {
        title: "Basic Widget Example",
        content: "Here's a simple example of a Flutter widget:",
        code: `
import 'package:flutter/material.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Flutter Demo'),
        ),
        body: Center(
          child: Text('Hello, Flutter!'),
        ),
      ),
    );
  }
}`,
      },
    ],
    summary:
      "Flutter is a powerful framework for building cross-platform applications with a single codebase. Its widget-based architecture and hot reload feature make it efficient for developers to create beautiful and performant apps.",
  },
  {
    id: "dart-fundamentals",
    title: "Dart Fundamentals",
    description: "Essential Dart language features for Flutter development",
    level: "junior" as const,
    estimatedTime: 20,
    content: [
      {
        title: "Dart Overview",
        content:
          "Dart is a client-optimized language for fast apps on any platform. It's developed by Google and is the language used for Flutter development.",
      },
      {
        title: "Variables and Types",
        content:
          "Dart is a statically typed language with type inference. You can declare variables using var, final, const, or explicit types.",
        code: `
// Variable declarations
void declareVariables() {
  var name = 'John'; // Type inferred as String
  String lastName = 'Doe'; // Explicit type
  final age = 30; // Cannot be reassigned
  const PI = 3.14159; // Compile-time constant
}`,
      },
      {
        title: "Functions",
        content:
          "Dart supports top-level functions, as well as methods tied to a class or object. Functions in Dart are objects and have a type, Function.",
        code: `
// Function declaration
void printName(String name) {
  print('Hello, \$name!');
}

// Arrow function
int add(int a, int b) => a + b;

// Optional parameters
void greet(String name, [String? greeting]) {
  print('\$greeting, \$name!');
}

// Named parameters
void introduce({required String name, int? age}) {
  print('My name is \$name\${age != null ? " and I am \$age years old" : ""}');
}`,
      },
      {
        title: "Control Flow",
        content:
          "Dart has the usual control flow statements like if-else, for loops, while loops, and switch statements.",
        code: `
// If-else statement
void checkAge() {
  int age = 20;
  if (age >= 18) {
    print('Adult');
  } else {
    print('Minor');
  }
}

// For loop
void countToFive() {
  for (var i = 0; i < 5; i++) {
    print(i);
  }
}

// While loop
void simpleWhile() {
  bool condition = true;
  int count = 0;
  while (condition) {
    count++;
    if (count > 5) condition = false;
  }
}

// Switch statement
void checkDay() {
  String day = 'Monday';
  switch (day) {
    case 'Monday':
      print('Start of the week');
      break;
    case 'Friday':
      print('End of the week');
      break;
    default:
      print('Mid-week');
  }
}`,
      },
    ],
    summary:
      "Dart is a modern, object-oriented language with features that make it ideal for Flutter development. Understanding Dart fundamentals is essential for becoming proficient in Flutter.",
  },
  {
    id: "flutter-widgets",
    title: "Flutter Widgets",
    description: "Understanding the building blocks of Flutter UI",
    level: "junior" as const,
    estimatedTime: 25,
    content: [
      {
        title: "Widget Types",
        content:
          "Flutter has two main types of widgets: StatelessWidget and StatefulWidget. StatelessWidget is immutable and doesn't change its state during the lifetime of the widget. StatefulWidget can change its appearance in response to events triggered by user interactions or when it receives data.",
      },
      {
        title: "Basic Widgets",
        content:
          "Flutter provides a rich set of basic widgets like Text, Row, Column, Stack, and Container that help you build complex UIs.",
        code: `
// Text widget
Text(
  'Hello, Flutter!',
  style: TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
  ),
)

// Container widget
Container(
  width: 200,
  height: 200,
  color: Colors.green,
  child: Center(
    child: Text('Centered Text'),
  ),
)

// Row and Column widgets
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: [
    Icon(Icons.star),
    Icon(Icons.star),
    Icon(Icons.star),
  ],
)

Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('First item'),
    Text('Second item'),
    Text('Third item'),
  ],
)`,
      },
      {
        title: "Layout Widgets",
        content:
          "Layout widgets help you arrange other widgets on the screen. Common layout widgets include Row, Column, Stack, and Container.",
      },
      {
        title: "Material Design Widgets",
        content:
          "Flutter provides a set of widgets that implement Material Design, such as AppBar, FloatingActionButton, and Drawer.",
      },
    ],
    summary:
      "Widgets are the core building blocks in Flutter. Understanding different types of widgets and how to compose them is fundamental to creating Flutter applications.",
  },

  // Middle level topics
  {
    id: "state-management",
    title: "State Management",
    description: "Different approaches to manage state in Flutter applications",
    level: "middle" as const,
    estimatedTime: 30,
    content: [
      {
        title: "What is State?",
        content:
          "In Flutter, 'state' refers to data that can change during the lifetime of the app. This could be user input, data from an API, or any other dynamic data that affects the UI.",
      },
      {
        title: "setState",
        content:
          "The simplest form of state management in Flutter is using setState() in StatefulWidget. This is suitable for simple apps with state confined to a single widget.",
        code: `
class CounterWidget extends StatefulWidget {
  @override
  _CounterWidgetState createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: \$_counter'),
        ElevatedButton(
          onPressed: _incrementCounter,
          child: Text('Increment'),
        ),
      ],
    );
  }
}`,
      },
      {
        title: "Provider",
        content:
          "Provider is a popular state management solution that uses the InheritedWidget to make state available throughout the widget tree.",
        code: `
// Define a ChangeNotifier
class CounterModel extends ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

// Provide the model to the widget tree
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => CounterModel(),
      child: MyApp(),
    ),
  );
}

// Consume the model
class CounterWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<CounterModel>(
      builder: (context, counter, child) {
        return Column(
          children: [
            Text('Count: \${counter.count}'),
            ElevatedButton(
              onPressed: () => counter.increment(),
              child: Text('Increment'),
            ),
          ],
        );
      },
    );
  }
}`,
      },
      {
        title: "Bloc/Cubit",
        content:
          "BLoC (Business Logic Component) is a state management pattern that helps separate business logic from the UI. Cubit is a simplified version of BLoC.",
      },
      {
        title: "GetX",
        content:
          "GetX is a lightweight state management solution that also provides route management and dependency injection.",
      },
      {
        title: "Riverpod",
        content:
          "Riverpod is an improved version of Provider that addresses some of its limitations and adds features like better dependency management.",
      },
    ],
    summary:
      "Choosing the right state management approach depends on the complexity of your app. For simple apps, setState might be sufficient, while larger apps might benefit from more structured approaches like Provider, Bloc, or Riverpod.",
  },
  {
    id: "navigation-routing",
    title: "Navigation & Routing",
    description: "Managing screens and navigation flow in Flutter apps",
    level: "middle" as const,
    estimatedTime: 25,
    content: [
      {
        title: "Basic Navigation",
        content:
          "Flutter provides the Navigator widget to manage a stack of routes. You can push and pop routes to navigate between screens.",
        code: `
// Navigate to a new screen
void navigateToNewScreen(BuildContext context) {
  Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => SecondScreen()),
  );
}

// Go back to the previous screen
void goBack(BuildContext context) {
  Navigator.pop(context);
}`,
      },
      {
        title: "Named Routes",
        content: "You can define named routes in your MaterialApp and navigate using route names.",
        code: `
// Define routes in MaterialApp
void defineRoutes() {
  MaterialApp(
    routes: {
      '/': (context) => HomeScreen(),
      '/details': (context) => DetailsScreen(),
      '/settings': (context) => SettingsScreen(),
    },
  );
}

// Navigate using route name
void navigateToDetails(BuildContext context) {
  Navigator.pushNamed(context, '/details');
}`,
      },
      {
        title: "Passing Data Between Screens",
        content: "You can pass data between screens when navigating.",
        code: `
// Pass data when navigating
void navigateWithData(BuildContext context, Item item) {
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => DetailsScreen(item: item),
    ),
  );
}

// Receive data in the destination screen
class DetailsScreen extends StatelessWidget {
  final Item item;

  DetailsScreen({required this.item});

  @override
  Widget build(BuildContext context) {
    // Use the item data
    return Container(); // Replace with actual UI
  }
}`,
      },
      {
        title: "Advanced Routing",
        content:
          "For more complex navigation patterns, you can use packages like go_router, auto_route, or get_it for dependency injection combined with navigation.",
      },
    ],
    summary:
      "Effective navigation is crucial for a good user experience. Flutter provides built-in navigation capabilities, and there are several packages available for more advanced routing needs.",
  },
  {
    id: "async-programming",
    title: "Asynchronous Programming",
    description: "Working with Future, Stream, and async/await in Flutter",
    level: "middle" as const,
    estimatedTime: 30,
    content: [
      {
        title: "Futures",
        content:
          "A Future represents a computation that doesn't complete immediately. It's similar to a Promise in JavaScript.",
        code: `
// Using a Future
Future<String> fetchData() async {
  // Simulate network request
  await Future.delayed(Duration(seconds: 2));
  return 'Data loaded';
}

// Consuming a Future
void loadData() async {
  try {
    String result = await fetchData();
    print(result);
  } catch (e) {
    print('Error: \$e');
  }
}`,
      },
      {
        title: "Streams",
        content:
          "A Stream is a sequence of asynchronous events. It's like an asynchronous Iterable—where, instead of getting the next event when you ask for it, the stream tells you when an event is ready.",
        code: `
// Creating a Stream
Stream<int> countStream(int max) async* {
  for (int i = 0; i < max; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

// Consuming a Stream
void listenToStream() {
  final stream = countStream(5);
  final subscription = stream.listen(
    (data) => print('Data: \$data'),
    onError: (error) => print('Error: \$error'),
    onDone: () => print('Stream done'),
  );
  
  // Cancel subscription when done
  // subscription.cancel();
}`,
      },
      {
        title: "async/await",
        content:
          "The async and await keywords provide a declarative way to define asynchronous functions and use their results.",
        code: `
// Using async/await
Future<void> fetchUserData() async {
  try {
    final userData = await fetchUser();
    final userPosts = await fetchPosts(userData.id);
    
    // Use userData and userPosts
  } catch (e) {
    // Handle errors
  }
}

Future<dynamic> fetchUser() async {
  await Future.delayed(Duration(seconds: 1));
  return {'id': 123, 'name': 'John'};
}

Future<List<String>> fetchPosts(int userId) async {
  await Future.delayed(Duration(seconds: 1));
  return ['Post 1', 'Post 2'];
}`,
      },
      {
        title: "FutureBuilder and StreamBuilder",
        content:
          "Flutter provides FutureBuilder and StreamBuilder widgets to easily work with asynchronous data in the UI.",
        code: `
// Using FutureBuilder
Widget buildFutureExample() {
  return FutureBuilder<String>(
    future: fetchData(),
    builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return CircularProgressIndicator();
      } else if (snapshot.hasError) {
        return Text('Error: \${snapshot.error}');
      } else {
        return Text('Data: \${snapshot.data}');
      }
    },
  );
}

// Using StreamBuilder
Widget buildStreamExample() {
  return StreamBuilder<int>(
    stream: countStream(10),
    builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return CircularProgressIndicator();
      } else if (snapshot.hasError) {
        return Text('Error: \${snapshot.error}');
      } else {
        return Text('Count: \${snapshot.data}');
      }
    },
  );
}`,
      },
    ],
    summary:
      "Asynchronous programming is essential for creating responsive Flutter apps. Futures and Streams, along with async/await syntax, provide powerful tools for handling asynchronous operations.",
  },

  // Senior level topics
  {
    id: "advanced-animations",
    title: "Advanced Animations",
    description: "Creating complex and custom animations in Flutter",
    level: "senior" as const,
    estimatedTime: 35,
    content: [
      {
        title: "Animation Controllers",
        content:
          "AnimationController is a special Animation object that generates a new value whenever the hardware is ready for a new frame. It has useful methods like forward(), reverse(), and repeat().",
        code: `
import 'package:flutter/material.dart';

class MyAnimation extends StatefulWidget {
  @override
  _MyAnimationState createState() => _MyAnimationState();
}

class _MyAnimationState extends State<MyAnimation> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );
    
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.scale(
          scale: _animation.value,
          child: child,
        );
      },
      child: Container(
        width: 200,
        height: 200,
        color: Colors.blue,
      ),
    );
  }
}`,
      },
      {
        title: "Custom Tween",
        content:
          "Tween (short for in-betweening) defines a mapping from an input range to an output range. You can create custom Tweens for complex animations.",
        code: `
import 'package:flutter/material.dart';

class ColorTween extends Tween<Color> {
  ColorTween({required Color begin, required Color end})
      : super(begin: begin, end: end);

  @override
  Color lerp(double t) {
    return Color.lerp(begin, end, t)!;
  }
}

// Usage
void animateColor(AnimationController _controller) {
  final animation = ColorTween(
    begin: Colors.blue,
    end: Colors.red,
  ).animate(_controller);
}`,
      },
      {
        title: "Hero Animations",
        content:
          "Hero animations are visual connections between screens, often used for shared elements during navigation.",
        code: `
import 'package:flutter/material.dart';

// First screen
Hero(
  tag: 'imageHero',
  child: Image.network('https://example.com/image.jpg'),
)

// Second screen
Hero(
  tag: 'imageHero',
  child: Image.network('https://example.com/image.jpg'),
)`,
      },
      {
        title: "Staggered Animations",
        content: "Staggered animations are animations that have multiple parts that start at different times.",
        code: `
import 'package:flutter/material.dart';

// Define multiple animations with different delays
void createStaggeredAnimation(AnimationController _controller) {
  final buttonAnimation = Tween<double>(begin: 0, end: 1).animate(
    CurvedAnimation(
      parent: _controller,
      curve: Interval(0.0, 0.5, curve: Curves.easeOut),
    ),
  );

  final textAnimation = Tween<double>(begin: 0, end: 1).animate(
    CurvedAnimation(
      parent: _controller,
      curve: Interval(0.5, 1.0, curve: Curves.easeIn),
    ),
  );
}`,
      },
      {
        title: "Custom Painters",
        content: "For highly customized animations, you can use CustomPainter to draw directly on the canvas.",
        code: `
import 'package:flutter/material.dart';

class CirclePainter extends CustomPainter {
  final double progress;

  CirclePainter(this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;
      
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width / 2) * progress;
    
    canvas.drawCircle(center, radius, paint);
  }

  @override
  bool shouldRepaint(CirclePainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}

// Usage
Widget buildCustomPaint(AnimationController _animation) {
  return AnimatedBuilder(
    animation: _animation,
    builder: (context, child) {
      return CustomPaint(
        painter: CirclePainter(_animation.value),
        size: Size(200, 200),
      );
    },
  );
}`,
      },
    ],
    summary:
      "Advanced animations can significantly enhance the user experience of your Flutter app. By mastering animation controllers, custom tweens, and custom painters, you can create unique and engaging animations.",
  },
  {
    id: "performance-optimization",
    title: "Performance Optimization",
    description: "Techniques to improve Flutter app performance and responsiveness",
    level: "senior" as const,
    estimatedTime: 40,
    content: [
      {
        title: "Widget Rebuilds",
        content:
          "Minimize unnecessary widget rebuilds by using const constructors, breaking down large widgets, and using efficient state management.",
      },
      {
        title: "Build Methods Optimization",
        content:
          "Keep build methods pure and lightweight. Avoid expensive operations in build methods and cache values when possible.",
        code: `
// Bad practice
Widget buildBadPractice() {
  int computeExpensiveValue() {
    return 100;
  }

  final expensiveValue = computeExpensiveValue(); // Don't do this
  return Text(expensiveValue.toString());
}

// Good practice
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late final int expensiveValue;
  
  @override
  void initState() {
    super.initState();
    expensiveValue = computeExpensiveValue(); // Do it once
  }

  int computeExpensiveValue() {
    return 100;
  }
  
  @override
  Widget build(BuildContext context) {
    return Text(expensiveValue.toString());
  }
}`,
      },
      {
        title: "ListView Optimization",
        content:
          "Use ListView.builder for long lists to render only visible items. Consider using indexed widgets like ListView.builder, GridView.builder, etc.",
        code: `
import 'package:flutter/material.dart';

Widget buildListViewBuilder(List<Item> items) {
  return ListView.builder(
    itemCount: items.length,
    itemBuilder: (context, index) {
      return ListTile(
        title: Text(items[index].title),
      );
    },
  );
}

class Item {
  final String title;
  Item( {required this.title});
}`,
      },
      {
        title: "Image Optimization",
        content:
          "Optimize images by using appropriate formats, sizes, and caching mechanisms. Consider using packages like cached_network_image for network images.",
      },
      {
        title: "Memory Management",
        content:
          "Avoid memory leaks by properly disposing resources, cancelling subscriptions, and using weak references when appropriate.",
      },
      {
        title: "Profiling Tools",
        content:
          "Use Flutter DevTools to profile your app's performance, identify bottlenecks, and optimize accordingly.",
      },
    ],
    summary:
      "Performance optimization is crucial for delivering a smooth user experience. By understanding how Flutter renders widgets and applying best practices, you can create highly performant applications.",
  },
  {
    id: "architecture-patterns",
    title: "Architecture Patterns",
    description: "Designing scalable and maintainable Flutter applications",
    level: "senior" as const,
    estimatedTime: 45,
    content: [
      {
        title: "MVC (Model-View-Controller)",
        content:
          "MVC separates an application into three components: Model (data), View (UI), and Controller (business logic).",
      },
      {
        title: "MVVM (Model-View-ViewModel)",
        content:
          "MVVM separates the UI from the business logic. The ViewModel acts as a bridge between the Model and the View.",
        code: `
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// Model
class User {
  final String name;
  final int age;
  
  User({required this.name, required this.age});
}

// ViewModel
class UserViewModel extends ChangeNotifier {
  User? _user;
  
  User? get user => _user;
  
  void fetchUser() async {
    // Fetch user from API or database
    _user = User(name: 'John Doe', age: 30);
    notifyListeners();
  }
}

// View
class UserScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => UserViewModel()..fetchUser(),
      child: Consumer<UserViewModel>(
        builder: (context, viewModel, child) {
          final user = viewModel.user;
          
          if (user == null) {
            return CircularProgressIndicator();
          }
          
          return Column(
            children: [
              Text('Name: \${user.name}'),
              Text('Age: \${user.age}'),
            ],
          );
        },
      ),
    );
  }
}`,
      },
      {
        title: "Clean Architecture",
        content:
          "Clean Architecture divides the application into layers (Entities, Use Cases, Interface Adapters, and Frameworks) to achieve separation of concerns and testability.",
      },
      {
        title: "BLoC (Business Logic Component)",
        content: "BLoC separates business logic from the UI by using Streams to communicate between layers.",
        code: `
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';

// Events
abstract class CounterEvent {}
class IncrementEvent extends CounterEvent {}
class DecrementEvent extends CounterEvent {}

// BLoC
class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<IncrementEvent>((event, emit) => emit(state + 1));
    on<DecrementEvent>((event, emit) => emit(state - 1));
  }
}

// UI
class CounterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => CounterBloc(),
      child: BlocBuilder<CounterBloc, int>(
        builder: (context, count) {
          return Column(
            children: [
              Text('Count: \$count'),
              ElevatedButton(
                onPressed: () => context.read<CounterBloc>().add(IncrementEvent()),
                child: Text('Increment'),
              ),
              ElevatedButton(
                onPressed: () => context.read<CounterBloc>().add(DecrementEvent()),
                child: Text('Decrement'),
              ),
            ],
          );
        },
      ),
    );
  }
}`,
      },
      {
        title: "Repository Pattern",
        content:
          "The Repository pattern abstracts the data source from the rest of the application, making it easier to switch between different data sources.",
      },
    ],
    summary:
      "Choosing the right architecture pattern depends on the size and complexity of your application. A well-designed architecture makes your code more maintainable, testable, and scalable.",
  },
]

// Quiz data
export const quizzes = [
  // Junior level quizzes
  {
    id: "flutter-basics-quiz",
    title: "Flutter Basics Quiz",
    description: "Test your knowledge of Flutter fundamentals",
    level: "junior" as const,
    questions: [
      {
        question: "What is Flutter?",
        options: {
          a: "A database management system",
          b: "A UI toolkit for building natively compiled applications",
          c: "A programming language",
          d: "A backend framework",
        },
        correctAnswer: "b",
        explanation:
          "Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
      },
      {
        question: "Which programming language is used for Flutter development?",
        options: {
          a: "JavaScript",
          b: "Kotlin",
          c: "Swift",
          d: "Dart",
        },
        correctAnswer: "d",
        explanation:
          "Dart is the programming language used for Flutter development. It's optimized for UI development and is developed by Google.",
      },
      {
        question: "What is a widget in Flutter?",
        options: {
          a: "A database table",
          b: "A UI component",
          c: "A function that returns HTML",
          d: "A type of animation",
        },
        correctAnswer: "b",
        explanation:
          "In Flutter, widgets are the basic building blocks of the UI. Everything in Flutter is a widget, from buttons to layouts to the app itself.",
      },
      {
        question: "Which of the following is NOT a basic layout widget in Flutter?",
        options: {
          a: "Container",
          b: "Row",
          c: "Fragment",
          d: "Column",
        },
        correctAnswer: "c",
        explanation:
          "Fragment is not a Flutter widget; it's an Android concept. Container, Row, and Column are all basic layout widgets in Flutter.",
      },
      {
        question: "What is hot reload in Flutter?",
        options: {
          a: "A feature that automatically fixes bugs in your code",
          b: "A feature that allows you to see changes in your code almost instantly without losing the app state",
          c: "A tool for performance optimization",
          d: "A way to deploy your app to production faster",
        },
        correctAnswer: "b",
        explanation:
          "Hot reload is a feature that allows developers to see the changes they make to the code almost instantly, without losing the current state of the app. This significantly speeds up the development process.",
      },
      {
        question: "Which widget would you use to create a scrollable list of widgets?",
        options: {
          a: "Container",
          b: "Column",
          c: "ListView",
          d: "Stack",
        },
        correctAnswer: "c",
        explanation:
          "ListView is used to create a scrollable list of widgets. It's efficient because it only renders the items that are currently visible on the screen.",
      },
      {
        question: "What is the purpose of the pubspec.yaml file in a Flutter project?",
        options: {
          a: "To define the app's UI layout",
          b: "To specify dependencies, assets, and metadata for the app",
          c: "To configure the database",
          d: "To write server-side code",
        },
        correctAnswer: "b",
        explanation:
          "The pubspec.yaml file is used to specify dependencies, assets, and metadata for the Flutter app. It's a crucial file for managing the project's configuration.",
      },
      {
        question: "Which of the following is true about StatelessWidget?",
        options: {
          a: "It can change its state during its lifetime",
          b: "It's slower than StatefulWidget",
          c: "It doesn't have a build method",
          d: "It's immutable and can't change its properties once created",
        },
        correctAnswer: "d",
        explanation:
          "StatelessWidget is immutable, meaning once it's created, its properties can't change. It's used for UI parts that don't need to change dynamically.",
      },
      {
        question: "How do you add an image from the assets folder in Flutter?",
        options: {
          a: "Image.asset('assets/image.png')",
          b: "Image.network('assets/image.png')",
          c: "Image.file('assets/image.png')",
          d: "Image.memory('assets/image.png')",
        },
        correctAnswer: "a",
        explanation:
          "Image.asset() is used to display an image from the assets folder. You also need to declare the asset in the pubspec.yaml file.",
      },
      {
        question: "What is the main function in a Flutter app?",
        options: {
          a: "It's optional and not required",
          b: "It's where you define all your widgets",
          c: "It's the entry point of the Flutter app",
          d: "It's used only for debugging",
        },
        correctAnswer: "c",
        explanation:
          "The main function is the entry point of a Flutter app. It's where the app starts executing, typically by calling runApp() with the root widget of the app.",
      },
    ],
  },
  {
    id: "dart-fundamentals-quiz",
    title: "Dart Fundamentals Quiz",
    description: "Test your knowledge of Dart programming language",
    level: "junior" as const,
    questions: [
      {
        question: "What is Dart?",
        options: {
          a: "A database system",
          b: "A programming language optimized for building user interfaces",
          c: "A testing framework",
          d: "A design pattern",
        },
        correctAnswer: "b",
        explanation:
          "Dart is a client-optimized programming language developed by Google. It's designed for building fast apps on any platform and is the language used for Flutter development.",
      },
      {
        question: "Which of the following is a correct way to declare a variable in Dart?",
        options: {
          a: "let name = 'John';",
          b: "const name = 'John';",
          c: "var name = 'John';",
          d: "string name = 'John';",
        },
        correctAnswer: "c",
        explanation:
          "In Dart, you can declare variables using 'var', which infers the type, or you can explicitly specify the type. 'let' is used in JavaScript, and 'string' is not a Dart keyword (it would be 'String' with a capital 'S').",
      },
      {
        question: "What is the difference between 'final' and 'const' in Dart?",
        options: {
          a: "There is no difference",
          b: "'final' can be set only once, 'const' is a compile-time constant",
          c: "'const' can be changed, 'final' cannot",
          d: "'final' is used for classes, 'const' is used for variables",
        },
        correctAnswer: "b",
        explanation:
          "Both 'final' and 'const' variables can only be assigned once. However, 'const' variables are compile-time constants, meaning their values must be known at compile time. 'final' variables can be assigned values at runtime.",
      },
      {
        question: "How do you define a function in Dart?",
        options: {
          a: "function add(a, b) { return a + b; }",
          b: "def add(a, b): return a + b",
          c: "int add(int a, int b) { return a + b; }",
          d: "add = (a, b) => { return a + b; }",
        },
        correctAnswer: "c",
        explanation:
          "In Dart, functions are defined with their return type (which can be omitted), followed by the function name and parameters. Option A is JavaScript syntax, B is Python, and D is a lambda expression which is not the standard way to define a function in Dart.",
      },
      {
        question: "What is the purpose of the '?' operator in Dart?",
        options: {
          a: "It's used for conditional (ternary) operations",
          b: "It indicates that a variable can be null",
          c: "It's used for pattern matching",
          d: "It's used for type casting",
        },
        correctAnswer: "b",
        explanation:
          "In Dart, the '?' operator after a type indicates that the variable can be null. For example, 'String?' means the variable can be either a String or null.",
      },
      {
        question: "How do you handle null safety in Dart?",
        options: {
          a: "By using try-catch blocks",
          b: "By using the '?' and '!' operators and the 'late' keyword",
          c: "By using the 'null' keyword",
          d: "Dart doesn't support null safety",
        },
        correctAnswer: "b",
        explanation:
          "Dart supports null safety through various features: '?' marks a variable as nullable, '!' asserts that a value isn't null, and 'late' declares a non-nullable variable that will be initialized later.",
      },
      {
        question: "What is a Dart class?",
        options: {
          a: "A blueprint for creating objects",
          b: "A type of function",
          c: "A module system",
          d: "A data structure like an array",
        },
        correctAnswer: "a",
        explanation:
          "In Dart, a class is a blueprint for creating objects. It defines properties and methods that the objects created from the class will have.",
      },
      {
        question: "How do you create an instance of a class in Dart?",
        options: {
          a: "new MyClass()",
          b: "MyClass.create()",
          c: "MyClass()",
          d: "create MyClass()",
        },
        correctAnswer: "c",
        explanation:
          "In Dart, you can create an instance of a class using 'MyClass()'. While 'new MyClass()' also works, the 'new' keyword is optional and often omitted in modern Dart code.",
      },
      {
        question: "What is a Dart mixin?",
        options: {
          a: "A way to achieve multiple inheritance",
          b: "A type of variable",
          c: "A design pattern",
          d: "A testing framework",
        },
        correctAnswer: "a",
        explanation:
          "Mixins in Dart provide a way to reuse a class's code in multiple class hierarchies. They're a way to achieve multiple inheritance of implementation without the complexities of traditional multiple inheritance.",
      },
      {
        question: "Which of the following is a correct way to handle asynchronous operations in Dart?",
        options: {
          a: "Using callbacks",
          b: "Using Promises",
          c: "Using async/await",
          d: "Both A and C",
        },
        correctAnswer: "d",
        explanation:
          "Dart supports both callback-based asynchronous programming and the more modern async/await syntax. Promises are a JavaScript concept; Dart uses Futures instead.",
      },
    ],
  },

  // Middle level quizzes
  {
    id: "state-management-quiz",
    title: "State Management Quiz",
    description: "Test your knowledge of state management in Flutter",
    level: "middle" as const,
    questions: [
      {
        question: "What is state in Flutter?",
        options: {
          a: "The UI of the application",
          b: "Data that can change during the lifetime of the widget or app",
          c: "The build method of a widget",
          d: "The theme of the application",
        },
        correctAnswer: "b",
        explanation:
          "State in Flutter refers to data that can change during the lifetime of a widget or the entire app. This could be user input, data from an API, or any other dynamic data that affects the UI.",
      },
      {
        question: "Which of the following is NOT a state management solution in Flutter?",
        options: {
          a: "Provider",
          b: "Bloc",
          c: "Redux",
          d: "Navigator",
        },
        correctAnswer: "d",
        explanation:
          "Navigator is not a state management solution; it's used for routing and navigation between screens. Provider, Bloc, and Redux are all state management solutions in Flutter.",
      },
      {
        question: "What is the purpose of setState() in Flutter?",
        options: {
          a: "To create a new state object",
          b: "To navigate to a new screen",
          c: "To notify the framework that the state has changed and the UI needs to be rebuilt",
          d: "To reset the state to its initial value",
        },
        correctAnswer: "c",
        explanation:
          "The setState() method is used to notify the Flutter framework that the state of the widget has changed. This triggers a rebuild of the widget and its descendants, reflecting the updated state in the UI.",
      },
      {
        question: "Which state management approach uses InheritedWidget under the hood?",
        options: {
          a: "Bloc",
          b: "GetX",
          c: "Provider",
          d: "MobX",
        },
        correctAnswer: "c",
        explanation:
          "Provider uses InheritedWidget under the hood to efficiently propagate and access state throughout the widget tree. It simplifies the use of InheritedWidget, which can be complex to use directly.",
      },
      {
        question: "What is the main advantage of using Bloc for state management?",
        options: {
          a: "It's the simplest approach",
          b: "It separates business logic from the UI",
          c: "It's the fastest in terms of performance",
          d: "It requires the least amount of code",
        },
        correctAnswer: "b",
        explanation:
          "The main advantage of Bloc (Business Logic Component) is that it separates business logic from the UI. This separation makes the code more testable, maintainable, and easier to reason about.",
      },
      {
        question: "In the context of Provider, what is a ChangeNotifier?",
        options: {
          a: "A widget that rebuilds when notified",
          b: "A class that provides a way to notify listeners when its data changes",
          c: "A type of animation",
          d: "A method to change the theme",
        },
        correctAnswer: "b",
        explanation:
          "ChangeNotifier is a class in Flutter that provides a way to notify listeners when its data changes. It's commonly used with Provider for state management, where UI widgets listen to changes in a ChangeNotifier and rebuild when notified.",
      },
      {
        question: "What is the difference between ephemeral state and app state?",
        options: {
          a: "Ephemeral state is persistent, app state is temporary",
          b: "Ephemeral state is local to a widget, app state is shared across multiple widgets",
          c: "Ephemeral state is managed by the framework, app state is managed by the developer",
          d: "There is no difference",
        },
        correctAnswer: "b",
        explanation:
          "Ephemeral state (also called local state) is state that is contained within a single widget and doesn't need to be shared. App state (also called shared state) is state that is shared across multiple widgets or the entire app.",
      },
      {
        question: "Which of the following is a characteristic of the Redux state management pattern?",
        options: {
          a: "Multiple stores for different types of state",
          b: "Direct mutation of state",
          c: "Single source of truth (one store)",
          d: "Bidirectional data flow",
        },
        correctAnswer: "c",
        explanation:
          "Redux follows three principles: single source of truth (one store), state is read-only (immutable), and changes are made with pure functions (reducers). Having a single store as the source of truth is a key characteristic of Redux.",
      },
      {
        question: "What is the purpose of the Consumer widget in Provider?",
        options: {
          a: "To create a new provider",
          b: "To listen to changes in a provider and rebuild only the part of the UI that depends on it",
          c: "To dispose of a provider when it's no longer needed",
          d: "To combine multiple providers",
        },
        correctAnswer: "b",
        explanation:
          "The Consumer widget in Provider is used to listen to changes in a provider and rebuild only the part of the UI that depends on the provider's data. This is more efficient than rebuilding the entire widget tree.",
      },
      {
        question: "In Bloc pattern, what is an Event?",
        options: {
          a: "A notification that the state has changed",
          b: "An input to the Bloc that triggers state changes",
          c: "A widget that displays the current state",
          d: "A method to update the UI",
        },
        correctAnswer: "b",
        explanation:
          "In the Bloc pattern, an Event is an input to the Bloc that triggers state changes. Events are typically user interactions or system events that the Bloc processes to produce new states.",
      },
    ],
  },
  {
    id: "navigation-routing-quiz",
    title: "Navigation & Routing Quiz",
    description: "Test your knowledge of navigation and routing in Flutter",
    level: "middle" as const,
    questions: [
      {
        question: "What is the Navigator in Flutter?",
        options: {
          a: "A widget that manages a set of child widgets with a stack discipline",
          b: "A tool for debugging navigation issues",
          c: "A state management solution",
          d: "A package for handling HTTP requests",
        },
        correctAnswer: "a",
        explanation:
          "The Navigator is a widget in Flutter that manages a stack of Route objects. It provides methods for managing the stack, like push and pop, which are used for navigating between screens.",
      },
      {
        question: "How do you navigate to a new screen in Flutter?",
        options: {
          a: "Navigator.push(context, route)",
          b: "Navigator.navigate(context, screen)",
          c: "Router.push(screen)",
          d: "Screen.navigate(context)",
        },
        correctAnswer: "a",
        explanation:
          "To navigate to a new screen in Flutter, you use Navigator.push() and provide the BuildContext and a Route object. The most common way is to use MaterialPageRoute to create the Route.",
      },
      {
        question: "What is the difference between Navigator.push() and Navigator.pushReplacement()?",
        options: {
          a: "There is no difference",
          b: "push() adds a new route to the stack, pushReplacement() replaces the current route",
          c: "push() is for MaterialApp, pushReplacement() is for CupertinoApp",
          d: "push() is synchronous, pushReplacement() is asynchronous",
        },
        correctAnswer: "b",
        explanation:
          "Navigator.push() adds a new route to the top of the navigator's stack. Navigator.pushReplacement() replaces the current route with a new one, which is useful when you don't want the user to be able to go back to the previous screen.",
      },
      {
        question: "How do you pass data to a new screen when navigating?",
        options: {
          a: "Using global variables",
          b: "Through constructor parameters",
          c: "Using a state management solution",
          d: "All of the above",
        },
        correctAnswer: "d",
        explanation:
          "You can pass data to a new screen in Flutter using any of these methods: through constructor parameters when creating the new screen, using global variables (though not recommended for most cases), or using a state management solution like Provider.",
      },
      {
        question: "What is a named route in Flutter?",
        options: {
          a: "A route with a specific animation",
          b: "A route identified by a string name",
          c: "A route that can only be accessed once",
          d: "A route with custom transition effects",
        },
        correctAnswer: "b",
        explanation:
          "A named route in Flutter is a route identified by a string name. Named routes are defined in the 'routes' parameter of MaterialApp or CupertinoApp, and you navigate to them using Navigator.pushNamed().",
      },
      {
        question: "How do you define named routes in Flutter?",
        options: {
          a: "In the pubspec.yaml file",
          b: "In the routes parameter of MaterialApp",
          c: "Using the Router class",
          d: "In a separate routes.dart file",
        },
        correctAnswer: "b",
        explanation:
          "Named routes in Flutter are defined in the 'routes' parameter of MaterialApp or CupertinoApp. It's a map where the keys are route names (strings) and the values are builder functions that create the corresponding screens.",
      },
      {
        question: "What is the purpose of the onGenerateRoute parameter in MaterialApp?",
        options: {
          a: "To handle routes that aren't defined in the routes parameter",
          b: "To generate random routes for testing",
          c: "To create animations for route transitions",
          d: "To log navigation events",
        },
        correctAnswer: "a",
        explanation:
          "The onGenerateRoute parameter in MaterialApp is a function that's called when the app is navigating to a named route that isn't defined in the routes parameter. It allows for dynamic route generation and handling of unknown routes.",
      },
      {
        question: "How do you return data from a screen when popping it?",
        options: {
          a: "Using Navigator.pop(context, data)",
          b: "Using a callback function",
          c: "Using a state management solution",
          d: "All of the above",
        },
        correctAnswer: "d",
        explanation:
          "You can return data from a screen when popping it using any of these methods: passing the data as the second argument to Navigator.pop(), using a callback function that was passed to the screen, or using a state management solution.",
      },
      {
        question: "What is deep linking in Flutter?",
        options: {
          a: "Linking to external websites from a Flutter app",
          b: "Linking to specific content or screens within a Flutter app from outside the app",
          c: "Linking multiple Flutter apps together",
          d: "Creating links between different parts of the app's UI",
        },
        correctAnswer: "b",
        explanation:
          "Deep linking in Flutter refers to the ability to link to specific content or screens within a Flutter app from outside the app, such as from a web URL, another app, or a notification. It allows users to navigate directly to specific parts of your app.",
      },
      {
        question: "Which package is commonly used for advanced routing in Flutter?",
        options: {
          a: "flutter_router",
          b: "navigator_2.0",
          c: "go_router",
          d: "path_provider",
        },
        correctAnswer: "c",
        explanation:
          "go_router is a popular package for advanced routing in Flutter. It provides a declarative approach to routing and supports features like deep linking, nested routes, and route guards. Other popular routing packages include auto_route and routemaster.",
      },
    ],
  },

  // Senior level quizzes
  {
    id: "advanced-flutter-quiz",
    title: "Advanced Flutter Quiz",
    description: "Test your knowledge of advanced Flutter concepts",
    level: "senior" as const,
    questions: [
      {
        question: "What is the Flutter widget tree?",
        options: {
          a: "A data structure that stores all the widgets in the app",
          b: "A hierarchical representation of the widgets that make up the UI",
          c: "A tool for debugging widget issues",
          d: "A type of animation in Flutter",
        },
        correctAnswer: "b",
        explanation:
          "The Flutter widget tree is a hierarchical representation of the widgets that make up the UI of a Flutter app. Each widget in the tree is a child of its parent widget, forming a tree-like structure.",
      },
      {
        question: "What is the difference between the widget tree and the element tree in Flutter?",
        options: {
          a: "The widget tree is for UI, the element tree is for logic",
          b: "The widget tree is immutable, the element tree maintains state and lifecycle",
          c: "The widget tree is for debug mode, the element tree is for release mode",
          d: "There is no difference",
        },
        correctAnswer: "b",
        explanation:
          "The widget tree in Flutter is immutable—widgets are lightweight configurations. The element tree, on the other hand, is mutable and maintains state and lifecycle. Elements are created from widgets and form the bridge between the widget tree and the render tree.",
      },
      {
        question: "What is the purpose of the BuildContext in Flutter?",
        options: {
          a: "To provide access to the theme and media query information",
          b: "To locate widgets in the widget tree",
          c: "To handle user input events",
          d: "Both A and B",
        },
        correctAnswer: "d",
        explanation:
          "BuildContext in Flutter serves multiple purposes: it provides access to the theme, media query, and other inherited widgets, and it also allows widgets to locate their position in the widget tree, which is essential for operations like finding ancestors or descendants.",
      },
      {
        question: "What is a CustomPainter in Flutter?",
        options: {
          a: "A widget that allows drawing custom shapes and paths",
          b: "A tool for customizing the app's theme",
          c: "A class for implementing custom animations",
          d: "A package for image editing",
        },
        correctAnswer: "a",
        explanation:
          "CustomPainter in Flutter is a class that allows you to draw custom shapes, paths, and other graphics directly on the canvas. It's used with the CustomPaint widget to create custom visual effects that aren't easily achievable with standard widgets.",
      },
      {
        question: "What is the Flutter DevTools?",
        options: {
          a: "A set of performance and debugging tools for Flutter apps",
          b: "A code editor specifically for Flutter development",
          c: "A package for managing dependencies",
          d: "A simulator for testing Flutter apps on different devices",
        },
        correctAnswer: "a",
        explanation:
          "Flutter DevTools is a suite of performance and debugging tools for Flutter. It includes features like a widget inspector, performance charts, memory profiler, and network profiler, helping developers diagnose and fix issues in their Flutter apps.",
      },
      {
        question: "What is the purpose of the GlobalKey in Flutter?",
        options: {
          a: "To uniquely identify a widget across the entire app",
          b: "To store global state",
          c: "To access platform-specific features",
          d: "To encrypt sensitive data",
        },
        correctAnswer: "a",
        explanation:
          "GlobalKey in Flutter is used to uniquely identify a widget across the entire app. It allows you to access the state and other properties of a widget from anywhere in the app, and it's also used for more advanced operations like moving a widget from one part of the tree to another.",
      },
      {
        question: "What is the Flutter engine?",
        options: {
          a: "A tool for compiling Dart code",
          b: "The core C++ library that provides low-level rendering support",
          c: "A state management solution",
          d: "A database for storing app data",
        },
        correctAnswer: "b",
        explanation:
          "The Flutter engine is the core C++ library that provides low-level rendering support using Skia, a 2D rendering engine. It handles tasks like rendering, text layout, file and network I/O, accessibility support, and plugin architecture.",
      },
      {
        question: "What is tree shaking in Flutter?",
        options: {
          a: "A technique to optimize the widget tree",
          b: "An animation effect",
          c: "A process that removes unused code from the final build",
          d: "A debugging technique",
        },
        correctAnswer: "c",
        explanation:
          "Tree shaking in Flutter is a process during compilation that removes unused code from the final build. This helps reduce the app size by eliminating code that isn't actually used in the application.",
      },
      {
        question: "What is the purpose of the InheritedWidget in Flutter?",
        options: {
          a: "To create custom animations",
          b: "To efficiently propagate information down the widget tree",
          c: "To handle user input",
          d: "To optimize rendering performance",
        },
        correctAnswer: "b",
        explanation:
          "InheritedWidget in Flutter is used to efficiently propagate information down the widget tree. It allows descendant widgets to access data from an ancestor widget without having to pass it explicitly through each level of the tree. Many Flutter features like Theme and MediaQuery use InheritedWidget under the hood.",
      },
      {
        question: "What is the difference between a StatelessWidget and a StatefulWidget?",
        options: {
          a: "StatelessWidget is faster, StatefulWidget is more flexible",
          b: "StatelessWidget doesn't have a build method, StatefulWidget does",
          c: "StatelessWidget is immutable and doesn't have state, StatefulWidget can have mutable state",
          d: "StatelessWidget is deprecated, StatefulWidget is the recommended approach",
        },
        correctAnswer: "c",
        explanation:
          "The main difference is that StatelessWidget is immutable and doesn't have state that changes over time, while StatefulWidget can have mutable state that can change during the lifetime of the widget. StatefulWidget consists of two classes: the widget itself and a State object that contains the mutable state and the build method.",
      },
    ],
  },
  {
    id: "architecture-patterns-quiz",
    title: "Architecture Patterns Quiz",
    description: "Test your knowledge of architecture patterns in Flutter",
    level: "senior" as const,
    questions: [
      {
        question: "What is the MVC pattern?",
        options: {
          a: "Model-View-Controller",
          b: "Model-View-Component",
          c: "Multiple-View-Controller",
          d: "Model-Variable-Component",
        },
        correctAnswer: "a",
        explanation:
          "MVC stands for Model-View-Controller. It's an architectural pattern that separates an application into three components: Model (data and business logic), View (UI), and Controller (handles user input and updates the model).",
      },
      {
        question: "What is the main advantage of using the MVVM pattern in Flutter?",
        options: {
          a: "It's the simplest pattern to implement",
          b: "It separates the UI from the business logic, making the code more testable",
          c: "It's the only pattern supported by Flutter",
          d: "It provides the best performance",
        },
        correctAnswer: "b",
        explanation:
          "The main advantage of MVVM (Model-View-ViewModel) in Flutter is that it separates the UI (View) from the business logic (ViewModel), making the code more testable, maintainable, and allowing for better separation of concerns.",
      },
      {
        question: "In the context of Clean Architecture, what is a Use Case?",
        options: {
          a: "A UI component",
          b: "A database operation",
          c: "A specific business rule or application-specific operation",
          d: "A testing strategy",
        },
        correctAnswer: "c",
        explanation:
          "In Clean Architecture, a Use Case (or Interactor) represents a specific business rule or application-specific operation. It contains the application logic and orchestrates the flow of data between the outer layers and the entities.",
      },
      {
        question: "What is the Repository pattern?",
        options: {
          a: "A pattern for storing local data",
          b: "A pattern that abstracts the data source from the rest of the application",
          c: "A pattern for managing UI components",
          d: "A pattern for handling user authentication",
        },
        correctAnswer: "b",
        explanation:
          "The Repository pattern is a design pattern that abstracts the data source (like a database, API, or cache) from the rest of the application. It provides a clean API for data access and hides the details of how the data is retrieved or stored.",
      },
      {
        question: "What is Dependency Injection?",
        options: {
          a: "A technique where an object receives other objects that it depends on",
          b: "A way to inject code into a running application",
          c: "A method for managing app state",
          d: "A tool for debugging dependencies",
        },
        correctAnswer: "a",
        explanation:
          "Dependency Injection is a technique where an object receives other objects that it depends on, rather than creating them itself. This promotes loose coupling, makes testing easier, and allows for more flexible and maintainable code.",
      },
      {
        question: "What is the BLoC pattern in Flutter?",
        options: {
          a: "Business Logic on Components",
          b: "Business Logic Component",
          c: "Basic Layout Component",
          d: "Binary Logic Controller",
        },
        correctAnswer: "b",
        explanation:
          "BLoC stands for Business Logic Component. It's a design pattern for Flutter developed by Google that helps separate business logic from the UI. It uses Streams for communication between the BLoC and the UI.",
      },
      {
        question: "In the context of the BLoC pattern, what is a Stream?",
        options: {
          a: "A sequence of asynchronous events",
          b: "A type of animation",
          c: "A UI component",
          d: "A database operation",
        },
        correctAnswer: "a",
        explanation:
          "In the BLoC pattern, a Stream is a sequence of asynchronous events. The BLoC exposes Streams that the UI can listen to for changes in state, and the UI sends events to the BLoC through Sinks.",
      },
      {
        question: "What is the purpose of the Domain layer in Clean Architecture?",
        options: {
          a: "To handle UI rendering",
          b: "To contain business logic and entities",
          c: "To manage database operations",
          d: "To handle network requests",
        },
        correctAnswer: "b",
        explanation:
          "In Clean Architecture, the Domain layer contains the business logic and entities of the application. It's the innermost layer and should be independent of any external frameworks or tools. It defines the core functionality of the application.",
      },
      {
        question: "What is the Single Responsibility Principle?",
        options: {
          a: "A class should have only one reason to change",
          b: "A method should have only one parameter",
          c: "An app should have only one screen",
          d: "A widget should have only one child",
        },
        correctAnswer: "a",
        explanation:
          "The Single Responsibility Principle is one of the SOLID principles of object-oriented design. It states that a class should have only one reason to change, meaning it should have only one responsibility or job.",
      },
      {
        question: "What is the purpose of the Data layer in Clean Architecture?",
        options: {
          a: "To handle UI rendering",
          b: "To contain business logic",
          c: "To manage data sources and repositories",
          d: "To define the app's navigation",
        },
        correctAnswer: "c",
        explanation:
          "In Clean Architecture, the Data layer is responsible for managing data sources (like APIs, databases, or caches) and repositories. It implements the repository interfaces defined in the Domain layer and provides the actual data to the application.",
      },
    ],
  },
]

// Combine the original topics with the additional topics
export const allTopics = [...topics, ...additionalTopics]

// Combine the original quizzes with the additional quizzes
export const allQuizzes = [...quizzes, ...additionalQuizzes]
