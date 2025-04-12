// Comprehensive Flutter interview questions from multiple sources
// Sources:
// - https://github.com/p0dyakov/flutter_interview
// - https://github.com/itsmelaxman/flutter-interview-preparation

export type InterviewQuestion = {
  question: string
  answer: string
  category: "dart" | "flutter" | "state-management" | "architecture" | "performance" | "testing" | "other"
  level: "junior" | "middle" | "senior"
}

export const interviewQuestions: InterviewQuestion[] = [
  // Dart Questions
  {
    question: "What is Dart?",
    answer:
      "Dart is a client-optimized programming language developed by Google. It's used to build mobile, desktop, server, and web applications. Dart is the language used for Flutter development and is designed to be fast, productive, and portable.",
    category: "dart",
    level: "junior",
  },
  {
    question: "What are the main features of Dart?",
    answer:
      "Key features of Dart include:\n- Object-oriented with classes and mixin-based inheritance\n- Optionally typed (combines static and runtime checks)\n- Garbage collection for memory management\n- Rich standard library\n- Asynchronous programming with async/await\n- JIT (Just-In-Time) and AOT (Ahead-Of-Time) compilation\n- Null safety\n- Isolates for concurrent execution",
    category: "dart",
    level: "junior",
  },
  {
    question: "Explain the difference between final and const in Dart.",
    answer:
      "Both `final` and `const` are used to create immutable variables, but they have key differences:\n\n- `final` variables can be assigned a value only once, and the value is determined at runtime.\n- `const` variables are compile-time constants, meaning their values must be known at compile time.\n\nFor example, `DateTime.now()` can be assigned to a `final` variable but not to a `const` variable because the value is determined at runtime. Additionally, `const` can be used to create constant values, and when applied to constructors, it creates constant objects.",
    category: "dart",
    level: "junior",
  },
  {
    question: "What is the difference between var, dynamic, and Object in Dart?",
    answer:
      "- `var`: Type is inferred at compile time based on the assigned value and cannot be changed later.\n- `dynamic`: Type checking is bypassed at compile time and performed at runtime. The variable can change its type.\n- `Object`: The base class for all Dart objects (except `null` in non-null-safe code). It's statically typed but can hold any object, though you need to cast before accessing specific methods.",
    category: "dart",
    level: "middle",
  },
  {
    question: "Explain Dart's null safety.",
    answer:
      "Dart's null safety (introduced in Dart 2.12) helps prevent null reference exceptions by making non-nullable types the default. Key features include:\n\n- Variables cannot contain null unless explicitly declared with a nullable type (using `?`).\n- The compiler enforces null checks before using nullable values.\n- The late keyword allows non-nullable variables to be initialized after declaration.\n- The `!` operator asserts that a nullable expression isn't null.\n- Flow analysis understands null checks and conditionals.\n\nThis system helps catch null errors at compile time rather than runtime.",
    category: "dart",
    level: "middle",
  },
  {
    question: "What are mixins in Dart?",
    answer:
      "Mixins are a way of reusing code in multiple class hierarchies. They allow you to share methods and properties between classes without using inheritance. In Dart, you create a mixin using the `mixin` keyword, and classes can incorporate the mixin using the `with` keyword. Mixins are particularly useful when you want to share functionality across different class hierarchies without creating complex inheritance trees.",
    category: "dart",
    level: "middle",
  },
  {
    question: "Explain Dart's asynchronous programming model.",
    answer:
      "Dart uses `Future` and `Stream` objects along with `async`/`await` syntax for asynchronous programming:\n\n- `Future`: Represents a value that will be available at some point in the future.\n- `Stream`: Represents a sequence of asynchronous events.\n- `async`: Marks a function as asynchronous, allowing the use of `await` inside it.\n- `await`: Pauses execution until a Future completes.\n\nThis model allows for writing asynchronous code that looks and behaves like synchronous code, making it easier to understand and maintain.",
    category: "dart",
    level: "middle",
  },
  {
    question: "What are isolates in Dart and how do they work?",
    answer:
      "Isolates are Dart's way of achieving concurrency. Each isolate has its own memory heap, ensuring no shared state between isolates. They communicate by passing messages through ports. This approach prevents common concurrency issues like race conditions and deadlocks.\n\nIsolates are particularly useful for CPU-intensive tasks that would otherwise block the main thread. In Flutter, you can use the `compute` function as a simplified way to spawn isolates for heavy computations.",
    category: "dart",
    level: "senior",
  },
  {
    question: "Explain extension methods in Dart.",
    answer:
      "Extension methods, introduced in Dart 2.7, allow you to add functionality to existing libraries and types without modifying them. You can extend any type, including built-in types like String or int, and even types from libraries you don't control. This feature is useful for adding utility methods, improving code readability, and organizing related functionality.\n\nExample:\n```dart\nextension NumberParsing on String {\n  int parseInt() {\n    return int.parse(this);\n  }\n}\n\nvoid main() {\n  var number = '42'.parseInt();\n}\n```",
    category: "dart",
    level: "middle",
  },
  {
    question: "What are generics in Dart and why are they useful?",
    answer:
      "Generics in Dart allow you to create classes, functions, and interfaces that work with different types while maintaining type safety. They're denoted using angle brackets (`<T>`). Generics are useful for:\n\n- Creating reusable components that work with any type\n- Providing compile-time type checking\n- Reducing code duplication\n- Improving code readability and maintainability\n\nFor example, `List<T>` can be specialized as `List<String>` or `List<int>`, ensuring type safety while reusing the same implementation.",
    category: "dart",
    level: "middle",
  },

  // Flutter Questions
  {
    question: "What is Flutter?",
    answer:
      "Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase. It uses the Dart programming language and provides a rich set of pre-designed widgets to create beautiful, natively compiled applications. Flutter's architecture is based on a reactive programming model and uses a fast rendering engine called Skia.",
    category: "flutter",
    level: "junior",
  },
  {
    question: "What are widgets in Flutter?",
    answer:
      "Widgets are the basic building blocks of Flutter applications. Everything in Flutter is a widget, from buttons and text to layouts and animations. Widgets can be structural (like Container, Row, Column), visual (like Text, Image, Icon), or interactive (like Button, Slider, TextField). Flutter uses a composition model where complex widgets are built by combining simpler widgets. There are two main types of widgets: StatelessWidget (immutable, rebuilt when parent changes) and StatefulWidget (maintains state that can change during the lifetime of the widget).",
    category: "flutter",
    level: "junior",
  },
  {
    question: "Explain the difference between StatelessWidget and StatefulWidget.",
    answer:
      "StatelessWidget and StatefulWidget are the two fundamental types of widgets in Flutter:\n\n- StatelessWidget: Immutable widgets that don't store any state. Their properties can't change over time. They're rebuilt whenever their parent widget is rebuilt. Ideal for UI parts that depend only on the configuration information and the BuildContext.\n\n- StatefulWidget: Widgets that maintain state that might change during the lifetime of the widget. They consist of two classes: the widget itself and a State object that contains the mutable state and the build method. When the state changes, the State object calls setState(), which triggers a rebuild of the widget.\n\nUse StatelessWidget for UI that doesn't change dynamically, and StatefulWidget when the UI needs to update dynamically.",
    category: "flutter",
    level: "junior",
  },
  {
    question: "What is the widget tree and element tree in Flutter?",
    answer:
      "Flutter uses three main trees to render the UI:\n\n1. Widget Tree: A configuration/blueprint of the UI. Widgets are immutable and lightweight.\n\n2. Element Tree: Created from the widget tree, it maintains the state and lifecycle of widgets. Elements are the instantiation of widgets and form a bridge between the widget tree and render tree.\n\n3. Render Tree: Handles layout and painting. It contains render objects that perform actual rendering.\n\nWhen setState() is called, Flutter rebuilds only the affected parts of the widget tree, and the element tree efficiently updates only what's necessary in the render tree. This architecture enables Flutter's high performance.",
    category: "flutter",
    level: "middle",
  },
  {
    question: "Explain the Flutter rendering pipeline.",
    answer:
      "The Flutter rendering pipeline consists of three main phases:\n\n1. Build: The widget's build method is called to produce a widget tree.\n\n2. Layout: The render tree determines the size and position of each element. This happens in two passes: a down pass where parent constraints are passed down, and an up pass where children report their sizes.\n\n3. Paint: The render objects generate paint commands that are sent to the Skia engine, which renders them to the screen.\n\nThis pipeline runs at 60fps (or the device's refresh rate) to create smooth animations. When setState() is called, Flutter marks the widget as needing rebuild and schedules a new frame.",
    category: "flutter",
    level: "senior",
  },
  {
    question: "What is BuildContext in Flutter?",
    answer:
      "BuildContext is an object that represents the location of a widget in the widget tree. It's passed to the build method of all widgets and provides access to:\n\n- Theme data, media queries, and other inherited widgets\n- Navigation methods (via Navigator.of(context))\n- Localization data\n- Size and layout constraints\n- State management (via Provider.of(context))\n\nBuildContext is crucial for many Flutter operations and allows widgets to interact with their ancestors and the overall app structure.",
    category: "flutter",
    level: "middle",
  },
  {
    question: "Explain the difference between hot reload and hot restart in Flutter.",
    answer:
      "Hot reload and hot restart are Flutter development features:\n\n- Hot Reload: Injects updated source code into the running Dart VM and rebuilds the widget tree, preserving the app state. It's faster (usually under a second) and keeps the current state, making it ideal for UI tweaks.\n\n- Hot Restart: Resets the app completely, restarting the Dart VM and losing all state. It's slower than hot reload but necessary when making changes to initialization code, state classes, or adding new dependencies.\n\nBoth features significantly speed up the development process compared to full rebuilds.",
    category: "flutter",
    level: "junior",
  },
  {
    question: "What are keys in Flutter and when should you use them?",
    answer:
      "Keys in Flutter are identifiers for widgets that help the framework track which widgets should be updated when the widget tree changes. They're particularly important when working with dynamic lists or collections of widgets.\n\nYou should use keys when:\n- Working with dynamic lists where items can be reordered, added, or removed\n- Moving widgets from one part of the tree to another\n- Preserving state when widget types remain the same but their configuration changes\n\nCommon types include:\n- ValueKey: Based on a specific value\n- ObjectKey: Based on object identity\n- UniqueKey: Generates a unique identifier each time\n- GlobalKey: Allows accessing the state of a widget from anywhere in the app",
    category: "flutter",
    level: "middle",
  },
  {
    question: "Explain Flutter's layout system.",
    answer:
      "Flutter's layout system is based on constraints and sizes. The layout process works as follows:\n\n1. A parent widget passes constraints (min/max width and height) down to its children.\n2. Children determine their sizes within those constraints.\n3. The parent positions the children based on their sizes.\n\nKey layout widgets include:\n- Container: For styling, padding, margins\n- Row/Column: For horizontal/vertical layouts\n- Stack: For overlapping widgets\n- Expanded/Flexible: For proportional sizing\n- Constraints widgets (SizedBox, ConstrainedBox): For explicit sizing\n\nThis constraint-based system ensures UI consistency across different screen sizes and orientations.",
    category: "flutter",
    level: "middle",
  },
  {
    question: "What are CustomPainter and CustomClipper in Flutter?",
    answer:
      "CustomPainter and CustomClipper are Flutter classes for creating custom graphics and shapes:\n\n- CustomPainter: Allows drawing custom shapes, paths, and graphics on a Canvas. You implement the paint() method to define what to draw. Used with the CustomPaint widget for complex visualizations, charts, or custom UI elements.\n\n- CustomClipper: Defines custom clipping paths for widgets. You implement the getClip() method to define the clipping boundary. Used with ClipPath to create non-rectangular widget shapes.\n\nBoth classes provide powerful ways to create unique visual elements beyond what's possible with standard widgets.",
    category: "flutter",
    level: "senior",
  },

  // State Management
  {
    question: "What is state management in Flutter?",
    answer:
      "State management in Flutter refers to how you manage and update the application's state (data) and reflect those changes in the UI. Flutter offers several approaches to state management, from simple solutions like setState() for local state to more complex solutions for application-wide state. Choosing the right state management approach depends on the app's complexity, team size, and specific requirements.",
    category: "state-management",
    level: "junior",
  },
  {
    question: "Compare different state management solutions in Flutter.",
    answer:
      "Flutter offers multiple state management solutions:\n\n- setState: Simple, built-in solution for local widget state.\n\n- Provider: Lightweight solution using InheritedWidget. Good for small to medium apps.\n\n- Riverpod: Evolution of Provider with improved dependency management and compile-time safety.\n\n- Bloc/Cubit: Uses streams for reactive programming. Separates business logic from UI. Good for complex apps.\n\n- GetX: All-in-one solution with state management, navigation, and dependency injection. Minimal boilerplate.\n\n- Redux: Predictable state container with unidirectional data flow. Complex setup but scales well.\n\n- MobX: Reactive state management using observables. Less boilerplate than Redux.\n\nThe best choice depends on app complexity, team familiarity, and specific requirements.",
    category: "state-management",
    level: "middle",
  },
  {
    question: "Explain the Provider pattern in Flutter.",
    answer:
      "Provider is a state management solution that uses InheritedWidget under the hood but simplifies its usage. Key components include:\n\n- ChangeNotifier: A class that provides change notifications to listeners.\n- ChangeNotifierProvider: Makes a ChangeNotifier instance available to its descendants.\n- Consumer/Provider.of: Widgets/methods to access the provided values.\n\nThe pattern follows these steps:\n1. Create a model class extending ChangeNotifier.\n2. Wrap widgets with ChangeNotifierProvider.\n3. Access the model using Consumer or Provider.of.\n4. Call notifyListeners() when the model changes.\n\nProvider is recommended by Flutter team for most use cases due to its simplicity and efficiency.",
    category: "state-management",
    level: "middle",
  },
  {
    question: "What is the BLoC pattern and how does it work?",
    answer:
      "BLoC (Business Logic Component) is a state management pattern that separates business logic from UI. It uses streams for reactive programming:\n\n- Events: Input actions from the UI.\n- States: Output UI states.\n- BLoC: Converts events to states using business logic.\n\nThe flow works as follows:\n1. UI sends events to the BLoC.\n2. BLoC processes events and emits new states.\n3. UI rebuilds based on the new states.\n\nImplementations include:\n- flutter_bloc: Full BLoC implementation with events and states.\n- Cubit: Simplified BLoC without explicit events.\n\nBLoC is ideal for complex applications requiring clear separation of concerns and testability.",
    category: "state-management",
    level: "senior",
  },
  {
    question: "Explain Riverpod and how it differs from Provider.",
    answer:
      "Riverpod is an evolution of Provider created by the same author to address some of Provider's limitations:\n\n- Compile-time safety: Catches errors at compile time rather than runtime.\n- No context requirement: Can access providers without BuildContext.\n- Provider overriding: Easier testing and overriding of providers.\n- Family modifiers: Parameterized providers.\n- Auto-disposal: Automatically disposes of unused providers.\n\nRiverpod uses:\n- Provider: Defines how to create a state.\n- ConsumerWidget/ConsumerStatefulWidget: Widgets that can read providers.\n- ref.watch/ref.read: Methods to access providers.\n\nRiverpod is ideal for applications requiring robust state management with better safety guarantees and flexibility.",
    category: "state-management",
    level: "senior",
  },
  {
    question: "What is GetX and what are its advantages?",
    answer:
      "GetX is a lightweight state management, navigation, and dependency injection solution for Flutter. Its key features include:\n\n- Simple state management: Reactive (Rx) and simple state management options.\n- Route management: Navigation without context.\n- Dependency injection: Simple service locator pattern.\n- Utilities: Internationalization, theme management, validation, etc.\n\nAdvantages:\n- Minimal boilerplate code\n- Performance optimization\n- Separation of concerns (logic, view, navigation)\n- No context dependency\n- Easy learning curve\n\nGetX is suitable for developers who want an all-in-one solution with minimal setup, though it may not follow Flutter's recommended patterns as closely as other solutions.",
    category: "state-management",
    level: "middle",
  },

  // Architecture
  {
    question: "What architectural patterns are commonly used in Flutter applications?",
    answer:
      "Common architectural patterns in Flutter include:\n\n- MVC (Model-View-Controller): Separates data, UI, and business logic.\n\n- MVVM (Model-View-ViewModel): Uses a ViewModel as a bridge between Model and View.\n\n- BLoC (Business Logic Component): Separates business logic using streams.\n\n- Clean Architecture: Divides the app into layers (Presentation, Domain, Data) with clear dependencies.\n\n- Redux: Uses a single store for state with actions and reducers.\n\n- Repository Pattern: Abstracts data sources behind a common interface.\n\nThe choice depends on app complexity, team size, and specific requirements. Many Flutter apps combine elements from multiple patterns.",
    category: "architecture",
    level: "senior",
  },
  {
    question: "Explain the Clean Architecture approach in Flutter.",
    answer:
      "Clean Architecture in Flutter divides the application into layers with clear dependencies:\n\n1. Presentation Layer: UI components (widgets, screens) and state management.\n\n2. Domain Layer: Business logic, use cases, and entity models. It's independent of any framework.\n\n3. Data Layer: Repositories and data sources (API, database).\n\nKey principles include:\n- Dependency Rule: Inner layers don't know about outer layers.\n- Entities: Core business objects.\n- Use Cases: Application-specific business rules.\n- Repositories: Abstract data access.\n- Dependency Injection: For loose coupling.\n\nBenefits include testability, maintainability, and scalability. While it adds initial complexity, it pays off in larger, long-term projects.",
    category: "architecture",
    level: "senior",
  },
  {
    question: "What is the Repository pattern and how is it used in Flutter?",
    answer:
      "The Repository pattern provides a clean API for data access that abstracts the underlying data sources. In Flutter:\n\n1. Repository Interface: Defines methods for data operations.\n\n2. Repository Implementation: Implements the interface and coordinates between different data sources.\n\n3. Data Sources: API clients, database helpers, etc.\n\nExample structure:\n```dart\n// Interface\nabstract class UserRepository {\n  Future<User> getUser(int id);\n}\n\n// Implementation\nclass UserRepositoryImpl implements UserRepository {\n  final ApiDataSource apiDataSource;\n  final LocalDataSource localDataSource;\n  \n  Future<User> getUser(int id) async {\n    // Try local first, then API if needed\n  }\n}\n```\n\nThis pattern makes it easy to switch data sources, implement caching strategies, and test data access logic.",
    category: "architecture",
    level: "senior",
  },
  {
    question: "What is Dependency Injection and how can it be implemented in Flutter?",
    answer:
      "Dependency Injection (DI) is a technique where an object receives its dependencies rather than creating them. In Flutter, DI can be implemented using:\n\n1. Constructor Injection: Pass dependencies via constructors.\n```dart\nclass UserService {\n  final ApiClient apiClient;\n  UserService(this.apiClient);\n}\n```\n\n2. Service Locator: Register and retrieve dependencies globally.\n- GetIt: Lightweight service locator.\n- Provider: Can be used for DI alongside state management.\n- Riverpod: Offers more type safety than Provider.\n- GetX: Includes a simple DI system.\n- injectable: Code generation for DI.\n\nBenefits include testability (easy mocking), flexibility (easy swapping implementations), and decoupling (reduced dependencies between components).",
    category: "architecture",
    level: "senior",
  },
  {
    question: "How do you handle navigation in large Flutter applications?",
    answer:
      "Navigation in large Flutter applications can be managed using:\n\n1. Route Management:\n- Named routes with Navigator 1.0\n- Declarative routing with Navigator 2.0\n- Third-party packages like auto_route, go_router, or get\n\n2. Navigation Patterns:\n- Coordinator/Flow pattern: Separate navigation logic from UI\n- Navigation service: Centralized navigation without context\n\n3. Deep Linking:\n- Handle external links and app-to-app navigation\n- Support for web URLs in web apps\n\n4. Route Guards:\n- Authentication checks before navigation\n- Permission validation\n\n5. Nested Navigation:\n- Bottom navigation with independent navigation stacks\n- Tabbed interfaces with preserved state\n\nThe key is to abstract navigation logic, make it testable, and handle complex scenarios like deep linking and authentication flows.",
    category: "architecture",
    level: "senior",
  },

  // Performance
  {
    question: "What are some common performance issues in Flutter and how do you solve them?",
    answer:
      "Common Flutter performance issues and solutions:\n\n1. Jank/Dropped Frames:\n- Use const constructors for static widgets\n- Implement ListView.builder for long lists\n- Use RepaintBoundary to isolate repaints\n\n2. Memory Leaks:\n- Properly dispose of controllers, streams, and animations\n- Cancel subscriptions when no longer needed\n- Use weak references for callbacks\n\n3. Slow Startup Time:\n- Reduce app size with --split-debug-info and obfuscation\n- Defer initialization of non-critical components\n- Use deferred loading for rarely used features\n\n4. Image Performance:\n- Use cached_network_image for network images\n- Resize images to appropriate dimensions before loading\n- Use appropriate image formats (WebP, JPEG)\n\n5. Build Method Optimization:\n- Keep build methods pure and lightweight\n- Extract widgets to minimize rebuilds\n- Use const constructors\n\nTools for diagnosis include Flutter DevTools, Performance Overlay, and Timeline events.",
    category: "performance",
    level: "senior",
  },
  {
    question: "How do you optimize Flutter applications for different platforms?",
    answer:
      "Optimizing Flutter apps for different platforms involves:\n\n1. Platform-Specific Code:\n- Use Platform.isIOS/isAndroid checks\n- Implement platform channels for native functionality\n- Use conditional imports with dart:io\n\n2. UI Adaptation:\n- Use Material/Cupertino widgets based on platform\n- Adapt to platform conventions (navigation, buttons)\n- Consider platform-specific gestures and interactions\n\n3. Performance Optimization:\n- Profile on real devices for each platform\n- Optimize asset sizes for target platforms\n- Consider platform-specific rendering limitations\n\n4. Web Optimization:\n- Use CanvasKit or HTML renderer appropriately\n- Optimize for SEO with metadata\n- Implement progressive loading\n\n5. Desktop Optimization:\n- Support keyboard shortcuts and mouse interactions\n- Adapt layouts for larger screens\n- Implement window management features\n\nThe goal is to maintain a consistent codebase while respecting platform conventions and optimizing for platform-specific capabilities.",
    category: "performance",
    level: "senior",
  },
  {
    question: "Explain how to reduce the size of a Flutter application.",
    answer:
      "Reducing Flutter app size can be achieved through:\n\n1. Build Optimization:\n- Enable R8/Proguard with minifyEnabled and shrinkResources\n- Use --split-debug-info to separate debug symbols\n- Enable code and resource obfuscation\n- Use --tree-shake-icons to remove unused icons\n\n2. Asset Optimization:\n- Compress images using WebP or optimized PNGs\n- Remove unused assets\n- Use appropriate resolution images\n- Consider loading some assets dynamically\n\n3. Package Management:\n- Avoid unnecessary dependencies\n- Use lightweight alternatives when possible\n- Consider splitting features into separate packages\n\n4. Code Optimization:\n- Remove unused code and imports\n- Use conditional imports for platform-specific code\n- Implement code splitting with deferred loading\n\n5. Native Code:\n- Optimize native plugins and dependencies\n- Remove unused native libraries\n\nMeasure size impact using the flutter build apk --analyze-size command and DevTools app size tool.",
    category: "performance",
    level: "senior",
  },
  {
    question: "What is tree shaking in Flutter and how does it work?",
    answer:
      "Tree shaking in Flutter is a build optimization technique that eliminates unused code from the final application bundle. It works by:\n\n1. Analyzing the dependency graph of the application.\n2. Identifying code that is never called or referenced.\n3. Removing that unused code from the final build.\n\nFlutter applies tree shaking to:\n\n- Dart code: Unused classes, methods, and variables are removed.\n- Icons: With --tree-shake-icons flag, only used icons from icon fonts are included.\n- Native code: Unused native libraries can be excluded.\n\nTo maximize tree shaking benefits:\n- Avoid dynamic code that can't be analyzed statically\n- Use conditional imports for platform-specific code\n- Split large features into separate packages\n- Avoid importing entire libraries when only specific parts are needed\n\nTree shaking significantly reduces app size, especially in larger applications with many dependencies.",
    category: "performance",
    level: "senior",
  },
  {
    question: "How do you profile and debug performance issues in Flutter?",
    answer:
      "Profiling and debugging performance in Flutter involves:\n\n1. DevTools:\n- Performance tab: Analyze UI and GPU threads\n- Memory tab: Track memory usage and leaks\n- CPU Profiler: Identify expensive operations\n- Widget Inspector: Analyze rebuild causes\n\n2. Performance Overlay:\n- Enable with WidgetsApp.showPerformanceOverlay\n- Shows UI thread (green) and GPU thread (red) performance\n\n3. Timeline Events:\n- Use Timeline.startSync/finishSync to mark custom events\n- Analyze in DevTools timeline view\n\n4. Frame Analysis:\n- Use PerformanceOverlay.allEnabled to identify jank\n- Look for frames exceeding 16ms (60fps) or 8ms (120fps)\n\n5. Memory Analysis:\n- Track allocations with DevTools Memory tab\n- Use HeapSnapshot for detailed memory analysis\n\n6. Automated Performance Testing:\n- Integration tests with performance metrics\n- CI/CD pipeline performance checks\n\nThe process typically involves: identifying the issue, measuring baseline performance, making targeted improvements, and verifying the impact.",
    category: "performance",
    level: "senior",
  },

  // Testing
  {
    question: "What are the different types of tests in Flutter?",
    answer:
      "Flutter supports three main types of tests:\n\n1. Unit Tests:\n- Test individual functions, methods, or classes\n- Fast execution and focused scope\n- Use the 'test' package\n- Example: Testing business logic, algorithms, or utility functions\n\n2. Widget Tests:\n- Test individual widgets or small widget trees\n- Verify widget properties, behavior, and interactions\n- Use the 'flutter_test' package\n- Faster than integration tests but can test UI components\n\n3. Integration Tests:\n- Test complete app or large parts of it\n- Run on real devices or emulators\n- Use the 'integration_test' package\n- Test user flows and interactions across multiple screens\n\nAdditionally, Flutter supports:\n- Golden Tests: Compare widget rendering against reference images\n- Performance Tests: Measure app performance metrics\n- Accessibility Tests: Verify app accessibility\n\nA comprehensive testing strategy typically includes all three types.",
    category: "testing",
    level: "middle",
  },
  {
    question: "How do you write widget tests in Flutter?",
    answer:
      "Widget tests in Flutter verify that widget UI and interactions work correctly:\n\n1. Setup:\n```dart\nimport 'package:flutter_test/flutter_test.dart';\n\nvoid main() {\n  testWidgets('Counter increments smoke test', (WidgetTester tester) async {\n    // Test code here\n  });\n}\n```\n\n2. Building Widgets:\n```dart\nawait tester.pumpWidget(MyApp());\n```\n\n3. Finding Widgets:\n```dart\nfinal counterTextFinder = find.text('0');\nfinal buttonFinder = find.byIcon(Icons.add);\n```\n\n4. Interacting with Widgets:\n```dart\nawait tester.tap(buttonFinder);\nawait tester.pump(); // Rebuild after state change\n```\n\n5. Verifying Results:\n```dart\nexpect(find.text('1'), findsOneWidget);\nexpect(find.text('0'), findsNothing);\n```\n\nWidget tests are faster than integration tests but still verify UI behavior, making them valuable for testing individual screens or components.",
    category: "testing",
    level: "middle",
  },
  {
    question: "Explain how to mock dependencies in Flutter tests.",
    answer:
      "Mocking dependencies in Flutter tests allows isolating the code being tested:\n\n1. Using the mockito package:\n```dart\n// Create a mock class\nclass MockAuthService extends Mock implements AuthService {}\n\n// In test\nfinal mockAuth = MockAuthService();\n// Configure mock behavior\nwhen(mockAuth.login(any, any)).thenAnswer((_) async => User('test'));\n// Inject mock into component being tested\nfinal component = MyComponent(authService: mockAuth);\n```\n\n2. Using the mocktail package (null safety friendly):\n```dart\n// Create a mock class\nclass MockAuthService extends Mock implements AuthService {}\n\n// In test\nfinal mockAuth = MockAuthService();\n// Configure mock behavior\nwhen(() => mockAuth.login(any(), any())).thenAnswer((_) async => User('test'));\n// Inject mock into component being tested\nfinal component = MyComponent(authService: mockAuth);\n```\n\n3. Using dependency injection:\n```dart\n// Register mock in test\nGetIt.instance.registerSingleton<AuthService>(MockAuthService());\n// Component uses GetIt.instance<AuthService>() internally\nfinal component = MyComponent();\n```\n\n4. Using provider for widget tests:\n```dart\nawait tester.pumpWidget(\n  Provider<AuthService>.value(\n    value: mockAuth,\n    child: MyWidget(),\n  ),\n);\n```\n\nMocking is essential for unit and widget tests to isolate components and test them independently of external dependencies like APIs, databases, or complex services.",
    category: "testing",
    level: "senior",
  },
  {
    question: "How do you implement integration tests in Flutter?",
    answer:
      "Integration tests in Flutter test the complete app or large parts of it on real devices or emulators:\n\n1. Setup:\n```dart\nimport 'package:integration_test/integration_test.dart';\n\nvoid main() {\n  IntegrationTestWidgetsFlutterBinding.ensureInitialized();\n  \n  group('end-to-end test', () {\n    testWidgets('tap on button, verify counter', (tester) async {\n      // Test code here\n    });\n  });\n}\n```\n\n2. Launch the app:\n```dart\napp.main();\nawait tester.pumpAndSettle();\n```\n\n3. Interact with the app:\n```dart\n// Find and tap a button\nawait tester.tap(find.byType(FloatingActionButton));\nawait tester.pumpAndSettle();\n\n// Verify the result\nexpect(find.text('1'), findsOneWidget);\n```\n\n4. Advanced features:\n- Take screenshots: `await takeScreenshot(tester, 'screenshot_name');`\n- Performance testing: Measure app startup time, frame rendering time\n- Test on multiple devices using Firebase Test Lab\n\nIntegration tests are slower but provide confidence that the entire app works correctly from the user's perspective.",
    category: "testing",
    level: "senior",
  },
  {
    question: "What are golden tests in Flutter and when should you use them?",
    answer:
      "Golden tests (also called screenshot tests) compare a widget's rendering against a reference image:\n\n1. Creating a golden test:\n```dart\ntestWidgets('Golden test', (WidgetTester tester) async {\n  await tester.pumpWidget(MyWidget());\n  await expectLater(\n    find.byType(MyWidget),\n    matchesGoldenFile('my_widget.png'),\n  );\n});\n```\n\n2. When to use golden tests:\n- UI components that must maintain a specific appearance\n- Design system components for consistency\n- Complex visualizations or custom paintings\n- When pixel-perfect rendering is critical\n\n3. Challenges and solutions:\n- Device/platform differences: Use specific goldens for each platform\n- CI environment differences: Use a consistent rendering environment\n- Intentional changes: Update goldens with `flutter test --update-goldens`\n\n4. Best practices:\n- Keep golden test files in a separate directory\n- Use descriptive names including platform/theme information\n- Test with different themes, locales, and screen sizes\n\nGolden tests complement widget and integration tests by focusing specifically on visual appearance rather than behavior.",
    category: "testing",
    level: "senior",
  },

  // Other
  {
    question: "How do you handle internationalization in Flutter?",
    answer:
      "Internationalization (i18n) in Flutter can be implemented using:\n\n1. Flutter's built-in i18n support:\n```dart\nimport 'package:flutter_localizations/flutter_localizations.dart';\n\nMaterialApp(\n  localizationsDelegates: [\n    GlobalMaterialLocalizations.delegate,\n    GlobalWidgetsLocalizations.delegate,\n    GlobalCupertinoLocalizations.delegate,\n    AppLocalizations.delegate, // Custom delegate\n  ],\n  supportedLocales: [\n    Locale('en'), // English\n    Locale('es'), // Spanish\n  ],\n);\n```\n\n2. Using the intl package:\n```dart\nimport 'package:intl/intl.dart';\n\nString greeting(String name) {\n  return Intl.message(\n    'Hello $name',\n    name: 'greeting',\n    desc: 'Greeting message',\n    args: [name],\n  );\n}\n```\n\n3. Using the flutter_intl or easy_localization packages for simplified workflow.\n\n4. Handling plurals and gender:\n```dart\nIntl.plural(\n  count,\n  zero: 'No items',\n  one: 'One item',\n  other: '$count items',\n);\n```\n\n5. Date, number, and currency formatting:\n```dart\nDateFormat.yMMMd().format(DateTime.now());\nNumberFormat.currency(locale: 'en_US', symbol: '$').format(1234.56);\n```\n\nThe approach involves extracting all user-facing strings, storing them in language-specific files, and loading the appropriate strings based on the user's locale.",
    category: "other",
    level: "middle",
  },
  {
    question: "How do you implement deep linking in Flutter?",
    answer:
      'Deep linking in Flutter allows opening the app with a specific URL and navigating to relevant content:\n\n1. Setup in Android (AndroidManifest.xml):\n```xml\n<intent-filter>\n  <action android:name="android.intent.action.VIEW" />\n  <category android:name="android.intent.category.DEFAULT" />\n  <category android:name="android.intent.category.BROWSABLE" />\n  <data android:scheme="myapp" android:host="open" />\n</intent-filter>\n```\n\n2. Setup in iOS (Info.plist):\n```xml\n<key>CFBundleURLTypes</key>\n<array>\n  <dict>\n    <key>CFBundleTypeRole</key>\n    <string>Editor</string>\n    <key>CFBundleURLName</key>\n    <string>com.example.myapp</string>\n    <key>CFBundleURLSchemes</key>\n    <array>\n      <string>myapp</string>\n    </array>\n  </dict>\n</array>\n```\n\n3. Handling links with uni_links package:\n```dart\n// For initial link\nfinal initialLink = await getInitialLink();\nif (initialLink != null) {\n  handleLink(initialLink);\n}\n\n// For links when app is running\nlinkStream.listen((String? link) {\n  if (link != null) {\n    handleLink(link);\n  }\n});\n\nvoid handleLink(String link) {\n  // Parse link and navigate\n  final uri = Uri.parse(link);\n  if (uri.pathSegments.contains(\'product\')) {\n    Navigator.pushNamed(context, \'/product/${uri.pathSegments.last}\');\n  }\n}\n```\n\n4. Using go_router for more robust handling:\n```dart\nGoRouter(\n  routes: [\n    GoRoute(\n      path: \'/product/:id\',\n      builder: (context, state) => ProductScreen(\n        id: state.params[\'id\']!,\n      ),\n    ),\n  ],\n);\n```\n\nDeep linking is essential for app discoverability, sharing content, and providing seamless user experiences across platforms.',
    category: "other",
    level: "senior",
  },
  {
    question: "How do you implement push notifications in Flutter?",
    answer:
      "Implementing push notifications in Flutter typically involves:\n\n1. Setup with Firebase Cloud Messaging (FCM):\n- Add firebase_messaging package\n- Configure Firebase project\n- Add google-services.json (Android) and GoogleService-Info.plist (iOS)\n\n2. Request permissions:\n```dart\nFirebaseMessaging messaging = FirebaseMessaging.instance;\nNotificationSettings settings = await messaging.requestPermission(\n  alert: true,\n  badge: true,\n  sound: true,\n);\n```\n\n3. Handle foreground messages:\n```dart\nFirebaseMessaging.onMessage.listen((RemoteMessage message) {\n  print('Got a message whilst in the foreground!');\n  if (message.notification != null) {\n    print('Notification: ${message.notification!.title}');\n    // Show in-app notification\n    showFlutterNotification(message.notification!);\n  }\n});\n```\n\n4. Handle background/terminated messages:\n```dart\n// In main.dart, before runApp()\nFirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);\n\n// Top-level function\nFuture<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {\n  await Firebase.initializeApp();\n  print('Handling a background message: ${message.messageId}');\n}\n```\n\n5. Handle notification taps:\n```dart\nFirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {\n  print('A notification was tapped!');  \n  // Navigate based on data\n  if (message.data['type'] == 'chat') {\n    Navigator.pushNamed(context, '/chat', arguments: message.data['id']);\n  }\n});\n```\n\n6. Platform-specific setup:\n- Android: Configure notification channel\n- iOS: Add capabilities in Xcode and handle APNs token\n\nFor more advanced features, consider packages like flutter_local_notifications for customizing notification appearance and behavior.",
    category: "other",
    level: "middle",
  },
  {
    question: "How do you implement authentication in Flutter?",
    answer:
      "Implementing authentication in Flutter can be done through several approaches:\n\n1. Firebase Authentication:\n```dart\n// Sign in with email/password\nUserCredential userCredential = await FirebaseAuth.instance.signInWithEmailAndPassword(\n  email: email,\n  password: password,\n);\n\n// Sign out\nawait FirebaseAuth.instance.signOut();\n\n// Listen to auth state changes\nFirebaseAuth.instance.authStateChanges().listen((User? user) {\n  if (user == null) {\n    print('User is signed out');\n  } else {\n    print('User is signed in');\n  }\n});\n```\n\n2. REST API Authentication:\n```dart\n// Sign in\nfinal response = await http.post(\n  Uri.parse('https://api.example.com/login'),\n  body: {'email': email, 'password': password},\n);\nif (response.statusCode == 200) {\n  final token = jsonDecode(response.body)['token'];\n  // Store token securely\n  await secureStorage.write(key: 'auth_token', value: token);\n}\n\n// Add token to requests\nfinal token = await secureStorage.read(key: 'auth_token');\nfinal response = await http.get(\n  Uri.parse('https://api.example.com/profile'),\n  headers: {'Authorization': 'Bearer $token'},\n);\n```\n\n3. Social Authentication:\n- Use packages like google_sign_in, flutter_facebook_auth\n- Integrate with Firebase Auth or your backend\n\n4. Secure Storage:\n- Use flutter_secure_storage for tokens\n- Consider biometric authentication with local_auth\n\n5. Auth State Management:\n- Create an AuthProvider/AuthBloc\n- Implement protected routes\n- Handle token refresh\n\nBest practices include secure token storage, proper error handling, implementing refresh tokens, and providing clear feedback to users during authentication processes.",
    category: "other",
    level: "middle",
  },
  {
    question: "How do you handle API calls in Flutter?",
    answer:
      "Handling API calls in Flutter involves several best practices:\n\n1. Using http or dio package for network requests:\n```dart\n// Using http\nimport 'package:http/http.dart' as http;\n\nFuture<User> fetchUser(int id) async {\n  final response = await http.get(Uri.parse('https://api.example.com/users/$id'));\n  \n  if (response.statusCode == 200) {\n    return User.fromJson(jsonDecode(response.body));\n  } else {\n    throw Exception('Failed to load user');\n  }\n}\n\n// Using dio\nimport 'package:dio/dio.dart';\n\nfinal dio = Dio();\n\nFuture<User> fetchUser(int id) async {\n  try {\n    final response = await dio.get('https://api.example.com/users/$id');\n    return User.fromJson(response.data);\n  } on DioError catch (e) {\n    throw Exception('Failed to load user: ${e.message}');\n  }\n}\n```\n\n2. Creating API service classes:\n```dart\nclass ApiService {\n  final Dio _dio = Dio(BaseOptions(\n    baseUrl: 'https://api.example.com',\n    connectTimeout: Duration(seconds: 5),\n    receiveTimeout: Duration(seconds: 3),\n  ));\n  \n  Future<User> getUser(int id) async { /* ... */ }\n  Future<List<Post>> getUserPosts(int userId) async { /* ... */ }\n}\n```\n\n3. Handling authentication:\n```dart\n_dio.interceptors.add(InterceptorsWrapper(\n  onRequest: (options, handler) {\n    final token = await _secureStorage.read(key: 'token');\n    options.headers['Authorization'] = 'Bearer $token';\n    return handler.next(options);\n  },\n));\n```\n\n4. Error handling and retry logic:\n```dart\ntry {\n  final response = await _dio.get('/users/$id');\n  return User.fromJson(response.data);\n} on DioError catch (e) {\n  if (e.type == DioErrorType.connectTimeout) {\n    // Retry logic\n  } else if (e.response?.statusCode == 401) {\n    // Handle authentication error\n  }\n  throw ApiException.fromDioError(e);\n}\n```\n\n5. Displaying in UI with FutureBuilder:\n```dart\nFutureBuilder<User>(\n  future: fetchUser(1),\n  builder: (context, snapshot) {\n    if (snapshot.connectionState == ConnectionState.waiting) {\n      return CircularProgressIndicator();\n    } else if (snapshot.hasError) {\n      return Text('Error: ${snapshot.error}');\n    } else {\n      return UserWidget(user: snapshot.data!);\n    }\n  },\n);\n```\n\n6. Caching strategies:\n- In-memory cache\n- Persistent storage with Hive or SharedPreferences\n- Offline-first approach with local database",
    category: "other",
    level: "middle",
  },
  {
    question: "What are Flutter plugins and how do you create one?",
    answer:
      "Flutter plugins are packages that provide access to platform-specific features or third-party services:\n\n1. Types of plugins:\n- Platform plugins: Access native APIs (camera, sensors, etc.)\n- Federated plugins: Split into platform-specific and common packages\n- Dart-only plugins: Pure Dart implementation\n\n2. Creating a basic plugin:\n```bash\nflutter create --template=plugin my_plugin\n```\n\n3. Plugin structure:\n```\nmy_plugin/\n  lib/ - Dart API\n  android/ - Android implementation\n  ios/ - iOS implementation\n  web/ - Web implementation (optional)\n  windows/, macos/, linux/ - Desktop implementations (optional)\n  example/ - Example app\n```\n\n4. Implementing platform channels:\n```dart\n// Dart side (lib/my_plugin.dart)\nclass MyPlugin {\n  static const MethodChannel _channel = MethodChannel('my_plugin');\n  \n  static Future<String?> getPlatformVersion() async {\n    return await _channel.invokeMethod('getPlatformVersion');\n  }\n}\n\n// Android side (android/src/main/kotlin/.../MyPlugin.kt)\nclass MyPlugin: FlutterPlugin, MethodCallHandler {\n  override fun onMethodCall(call: MethodCall, result: Result) {\n    if (call.method == \"getPlatformVersion\") {\n      result.success(\"Android ${android.os.Build.VERSION.RELEASE}\")\n    } else {\n      result.notImplemented()\n    }\n  }\n}\n```\n\n5. Testing plugins:\n- Unit tests for Dart code\n- Integration tests with example app\n- Platform-specific tests\n\n6. Publishing:\n- Update pubspec.yaml with details\n- Run `flutter pub publish`\n\nPlugins are essential for accessing native functionality and integrating with platform-specific APIs or third-party services.",
    category: "other",
    level: "senior",
  },
]

// Additional Flutter resources from both repositories
export const flutterResources = [
  {
    title: "Flutter Interview",
    url: "https://github.com/p0dyakov/flutter_interview",
    description: "A comprehensive collection of Flutter interview questions and answers",
  },
  {
    title: "Flutter Interview Preparation",
    url: "https://github.com/itsmelaxman/flutter-interview-preparation",
    description: "Curated list of Flutter interview questions and resources",
  },
  {
    title: "Flutter Roadmap",
    url: "https://github.com/olexale/flutter_roadmap",
    description: "A roadmap to becoming a Flutter developer",
  },
  {
    title: "Flutter Articles",
    url: "https://github.com/flutter-articles/flutter-articles",
    description: "A collection of articles about Flutter development",
  },
  {
    title: "Flutter Best Packages",
    url: "https://github.com/leisim/awesome-flutter-packages",
    description: "A curated list of the best Flutter packages",
  },
  {
    title: "Flutter Tools",
    url: "https://github.com/flutter/tools",
    description: "Tools for Flutter development",
  },
  {
    title: "Flutter Awesome",
    url: "https://github.com/Solido/awesome-flutter",
    description: "An awesome list of Flutter resources",
  },
  {
    title: "Flutter Samples",
    url: "https://github.com/flutter/samples",
    description: "Official Flutter samples from the Flutter team",
  },
  {
    title: "Flutter Gems",
    url: "https://fluttergems.dev/",
    description: "A curated list of Flutter packages and libraries",
  },
  {
    title: "Flutter Community",
    url: "https://flutter.dev/community",
    description: "Official Flutter community resources",
  },
]

// Flutter coding challenges for practice
export const flutterChallenges = [
  {
    title: "Build a Todo App",
    description: "Create a simple todo app with CRUD operations and local storage",
    level: "junior",
  },
  {
    title: "Weather App",
    description: "Build a weather app that fetches data from a public API and displays it with animations",
    level: "junior",
  },
  {
    title: "E-commerce App UI",
    description: "Implement the UI for an e-commerce app with product listings, cart, and checkout screens",
    level: "middle",
  },
  {
    title: "Chat Application",
    description: "Create a real-time chat application using Firebase or another backend service",
    level: "middle",
  },
  {
    title: "Social Media Feed",
    description: "Implement an infinite scrolling social media feed with complex UI elements",
    level: "middle",
  },
  {
    title: "Music Player",
    description: "Build a music player with background audio, notifications, and media controls",
    level: "senior",
  },
  {
    title: "Custom Animation Library",
    description: "Create a reusable animation library with custom transitions and effects",
    level: "senior",
  },
  {
    title: "State Management Comparison",
    description: "Implement the same app using different state management solutions and compare performance",
    level: "senior",
  },
]
