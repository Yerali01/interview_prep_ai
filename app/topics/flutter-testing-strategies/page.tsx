"use client"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FlutterTestingStrategiesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Flutter Testing Strategies</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive guide to testing Flutter applications for quality and reliability
        </p>
      </motion.div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="unit">Unit Testing</TabsTrigger>
          <TabsTrigger value="widget">Widget Testing</TabsTrigger>
          <TabsTrigger value="integration">Integration Testing</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Flutter Testing Overview</h2>
            <p>
              Testing is an essential part of app development, helping you catch bugs early, ensure your app works as
              expected, and maintain code quality as your project evolves. Flutter provides a robust testing framework
              that enables you to test your app at different levels:
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">Unit Tests</h3>
                <p className="text-sm">
                  Test individual functions, methods, or classes in isolation. Focus on the logic and behavior of
                  specific components.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">Widget Tests</h3>
                <p className="text-sm">
                  Test individual widgets or small widget combinations to verify their appearance and behavior.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">Integration Tests</h3>
                <p className="text-sm">
                  Test complete app flows and interactions between multiple components or screens.
                </p>
              </div>
            </div>

            <h3>Benefits of Testing Flutter Applications</h3>
            <ul>
              <li>
                <strong>Confidence in code changes:</strong> Testing helps ensure that new changes don't break existing
                functionality.
              </li>
              <li>
                <strong>Documentation:</strong> Tests serve as executable documentation of how components should behave.
              </li>
              <li>
                <strong>Design feedback:</strong> Widget tests can reveal issues with your UI design.
              </li>
              <li>
                <strong>Faster development:</strong> Identifying issues early in the development process saves time in
                the long run.
              </li>
              <li>
                <strong>Regression prevention:</strong> Tests help catch regressions when you refactor code or add new
                features.
              </li>
            </ul>

            <h3>Testing Pyramid in Flutter</h3>
            <p>In Flutter, the testing pyramid still applies, though with slightly different terminology:</p>
            <ol>
              <li>
                <strong>Unit Tests (Base):</strong> Fast, focused tests of individual components.
              </li>
              <li>
                <strong>Widget Tests (Middle):</strong> Test widgets in isolation from the rest of the app.
              </li>
              <li>
                <strong>Integration Tests (Top):</strong> Test the complete app running on a device or emulator.
              </li>
            </ol>

            <p>
              You should have more unit tests than widget tests, and more widget tests than integration tests. This
              approach provides a balance between testing coverage, speed, and maintenance effort.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="unit" className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Unit Testing in Flutter</h2>
            <p>
              Unit tests focus on verifying the behavior of individual functions, methods, or classes in isolation. They
              help ensure that each piece of your code works correctly on its own.
            </p>

            <h3>Setting Up Unit Tests</h3>
            <p>
              In your Flutter project, unit tests are typically located in the <code>test/</code> directory. To create a
              unit test file:
            </p>
            <ol>
              <li>
                Create a file named <code>[filename]_test.dart</code> in the test directory
              </li>
              <li>
                Import the <code>test</code> package and the component you want to test
              </li>
              <li>
                Write test cases using the <code>test()</code> function
              </li>
            </ol>

            <h3>Basic Unit Test Structure</h3>
            <pre>
              <code>
                {`import 'package:test/test.dart';
import 'package:your_app/your_component.dart';

void main() {
  group('YourComponent', () {
    test('should do something expected', () {
      // Arrange - set up test environment
      final component = YourComponent();
      
      // Act - call the method you're testing
      final result = component.someMethod();
      
      // Assert - verify the result is as expected
      expect(result, equals(expectedValue));
    });
    
    test('should handle edge case', () {
      // Another test case
    });
  });
}`}
              </code>
            </pre>

            <h3>Testing Different Components</h3>
            <h4>Testing a Utility Function</h4>
            <pre>
              <code>
                {`// lib/utils/calculator.dart
class Calculator {
  int add(int a, int b) => a + b;
  int subtract(int a, int b) => a - b;
}

// test/utils/calculator_test.dart
import 'package:test/test.dart';
import 'package:your_app/utils/calculator.dart';

void main() {
  group('Calculator', () {
    late Calculator calculator;
    
    setUp(() {
      calculator = Calculator();
    });
    
    test('should add two numbers correctly', () {
      expect(calculator.add(2, 3), equals(5));
      expect(calculator.add(-1, 1), equals(0));
      expect(calculator.add(0, 0), equals(0));
    });
    
    test('should subtract two numbers correctly', () {
      expect(calculator.subtract(5, 2), equals(3));
      expect(calculator.subtract(1, 1), equals(0));
      expect(calculator.subtract(0, 5), equals(-5));
    });
  });
}`}
              </code>
            </pre>

            <h4>Testing a Model Class</h4>
            <pre>
              <code>
                {`// lib/models/user.dart
class User {
  final String name;
  final int age;
  
  User({required this.name, required this.age});
  
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      name: json['name'] as String,
      age: json['age'] as int,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'age': age,
    };
  }
  
  bool isAdult() => age >= 18;
}

// test/models/user_test.dart
import 'package:test/test.dart';
import 'package:your_app/models/user.dart';

void main() {
  group('User', () {
    test('should create User from JSON', () {
      final json = {'name': 'John', 'age': 25};
      final user = User.fromJson(json);
      
      expect(user.name, equals('John'));
      expect(user.age, equals(25));
    });
    
    test('should convert User to JSON', () {
      final user = User(name: 'Jane', age: 30);
      final json = user.toJson();
      
      expect(json, equals({'name': 'Jane', 'age': 30}));
    });
    
    test('should determine if user is adult', () {
      expect(User(name: 'Child', age: 12).isAdult(), isFalse);
      expect(User(name: 'Teen', age: 17).isAdult(), isFalse);
      expect(User(name: 'Adult', age: 18).isAdult(), isTrue);
      expect(User(name: 'Senior', age: 65).isAdult(), isTrue);
    });
  });
}`}
              </code>
            </pre>

            <h3>Testing with Dependencies</h3>
            <p>
              When a component depends on other components, you should use mocks or fakes to isolate the component under
              test. The <code>mockito</code> package is commonly used for this purpose.
            </p>
            <pre>
              <code>
                {`// lib/services/user_service.dart
class UserService {
  final ApiClient apiClient;
  
  UserService(this.apiClient);
  
  Future<User> getUser(int id) async {
    final json = await apiClient.get('/users/$id');
    return User.fromJson(json);
  }
}

// test/services/user_service_test.dart
import 'package:test/test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:your_app/services/user_service.dart';

@GenerateMocks([ApiClient])
import 'user_service_test.mocks.dart';

void main() {
  group('UserService', () {
    late MockApiClient mockApiClient;
    late UserService userService;
    
    setUp(() {
      mockApiClient = MockApiClient();
      userService = UserService(mockApiClient);
    });
    
    test('should fetch user by id', () async {
      // Arrange
      when(mockApiClient.get('/users/1')).thenAnswer(
        (_) async => {'name': 'John', 'age': 25}
      );
      
      // Act
      final user = await userService.getUser(1);
      
      // Assert
      expect(user.name, equals('John'));
      expect(user.age, equals(25));
      verify(mockApiClient.get('/users/1')).called(1);
    });
  });
}`}
              </code>
            </pre>

            <h3>Running Unit Tests</h3>
            <p>You can run tests using the Flutter CLI:</p>
            <pre>
              <code>
                {`# Run a specific test file
flutter test test/utils/calculator_test.dart

# Run all tests
flutter test`}
              </code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="widget" className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Widget Testing in Flutter</h2>
            <p>
              Widget tests verify that the UI renders correctly and handles user interactions as expected. They test
              individual widgets or small widget combinations in isolation, without requiring a full app environment.
            </p>

            <h3>Setting Up Widget Tests</h3>
            <p>
              Widget tests are also stored in the <code>test/</code> directory. To create a widget test:
            </p>
            <ol>
              <li>
                Create a file named <code>[widget_name]_test.dart</code> in the test directory
              </li>
              <li>
                Import the <code>flutter_test</code> package and the widget you want to test
              </li>
              <li>
                Write test cases using the <code>testWidgets()</code> function
              </li>
            </ol>

            <h3>Basic Widget Test Structure</h3>
            <pre>
              <code>
                {`import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:your_app/widgets/your_widget.dart';

void main() {
  group('YourWidget', () {
    testWidgets('should render correctly', (WidgetTester tester) async {
      // Build the widget
      await tester.pumpWidget(
        MaterialApp(
          home: YourWidget(),
        ),
      );
      
      // Verify widget properties
      expect(find.text('Expected Text'), findsOneWidget);
      
      // Optional: Capture a screenshot for visual comparison
      await expectLater(
        find.byType(YourWidget),
        matchesGoldenFile('your_widget.png'),
      );
    });
    
    testWidgets('should handle user interaction', (WidgetTester tester) async {
      // Build the widget
      await tester.pumpWidget(
        MaterialApp(
          home: YourWidget(),
        ),
      );
      
      // Perform user interaction
      await tester.tap(find.byType(ElevatedButton));
      
      // Rebuild the widget after interaction
      await tester.pump();
      
      // Verify the expected outcome
      expect(find.text('New Text After Interaction'), findsOneWidget);
    });
  });
}`}
              </code>
            </pre>

            <h3>Testing Different Widgets</h3>
            <h4>Testing a Counter Widget</h4>
            <pre>
              <code>
                {`// lib/widgets/counter_widget.dart
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
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Count: $_counter'),
        ElevatedButton(
          onPressed: _incrementCounter,
          child: Text('Increment'),
        ),
      ],
    );
  }
}

// test/widgets/counter_widget_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:your_app/widgets/counter_widget.dart';

void main() {
  group('CounterWidget', () {
    testWidgets('should display initial count of 0', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CounterWidget(),
          ),
        ),
      );
      
      expect(find.text('Count: 0'), findsOneWidget);
    });
    
    testWidgets('should increment count when button is tapped', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CounterWidget(),
          ),
        ),
      );
      
      // Verify initial state
      expect(find.text('Count: 0'), findsOneWidget);
      
      // Tap the increment button
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      
      // Verify the count increased
      expect(find.text('Count: 1'), findsOneWidget);
      
      // Tap again
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      
      // Verify the count increased again
      expect(find.text('Count: 2'), findsOneWidget);
    });
  });
}`}
              </code>
            </pre>

            <h4>Testing a Form Widget</h4>
            <pre>
              <code>
                {`// lib/widgets/login_form.dart
class LoginForm extends StatefulWidget {
  final Function(String, String) onSubmit;
  
  LoginForm({required this.onSubmit});
  
  @override
  _LoginFormState createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _emailController,
            decoration: InputDecoration(labelText: 'Email'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your email';
              }
              return null;
            },
          ),
          TextFormField(
            controller: _passwordController,
            decoration: InputDecoration(labelText: 'Password'),
            obscureText: true,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your password';
              }
              if (value.length < 6) {
                return 'Password must be at least 6 characters';
              }
              return null;
            },
          ),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                widget.onSubmit(
                  _emailController.text,
                  _passwordController.text,
                );
              }
            },
            child: Text('Login'),
          ),
        ],
      ),
    );
  }
  
  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}

// test/widgets/login_form_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:your_app/widgets/login_form.dart';

void main() {
  group('LoginForm', () {
    testWidgets('should show validation errors for empty fields', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LoginForm(onSubmit: (_, __) {}),
          ),
        ),
      );
      
      // Tap the login button without entering any data
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      
      // Verify validation errors are shown
      expect(find.text('Please enter your email'), findsOneWidget);
      expect(find.text('Please enter your password'), findsOneWidget);
    });
    
    testWidgets('should show validation error for short password', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LoginForm(onSubmit: (_, __) {}),
          ),
        ),
      );
      
      // Enter email
      await tester.enterText(find.widgetWithText(TextFormField, 'Email'), 'test@example.com');
      
      // Enter short password
      await tester.enterText(find.widgetWithText(TextFormField, 'Password'), '12345');
      
      // Tap the login button
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      
      // Verify validation error for password
      expect(find.text('Password must be at least 6 characters'), findsOneWidget);
    });
    
    testWidgets('should call onSubmit with correct values when form is valid', (WidgetTester tester) async {
      String? submittedEmail;
      String? submittedPassword;
      
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LoginForm(
              onSubmit: (email, password) {
                submittedEmail = email;
                submittedPassword = password;
              },
            ),
          ),
        ),
      );
      
      // Enter valid email and password
      await tester.enterText(find.widgetWithText(TextFormField, 'Email'), 'test@example.com');
      await tester.enterText(find.widgetWithText(TextFormField, 'Password'), 'password123');
      
      // Tap the login button
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      
      // Verify onSubmit was called with correct values
      expect(submittedEmail, equals('test@example.com'));
      expect(submittedPassword, equals('password123'));
    });
  });
}`}
              </code>
            </pre>

            <h3>Common Widget Testing Techniques</h3>
            <h4>Finding Widgets</h4>
            <ul>
              <li>
                <code>find.text('Text to find')</code> - Find widgets with specific text
              </li>
              <li>
                <code>find.byType(WidgetType)</code> - Find widgets by their type
              </li>
              <li>
                <code>find.byKey(Key('widget_key'))</code> - Find widgets by key
              </li>
              <li>
                <code>find.byIcon(Icons.add)</code> - Find widgets with specific icon
              </li>
              <li>
                <code>find.bySemanticsLabel('label')</code> - Find widgets by semantics label
              </li>
            </ul>

            <h4>Interacting with Widgets</h4>
            <ul>
              <li>
                <code>await tester.tap(finder)</code> - Tap a widget
              </li>
              <li>
                <code>await tester.enterText(finder, 'text')</code> - Enter text in a text field
              </li>
              <li>
                <code>await tester.drag(finder, Offset(dx, dy))</code> - Drag a widget
              </li>
              <li>
                <code>await tester.longPress(finder)</code> - Long press a widget
              </li>
              <li>
                <code>await tester.scrollUntilVisible(finder, scrollDelta)</code> - Scroll until a widget is visible
              </li>
            </ul>

            <h4>Verifying Widget State</h4>
            <ul>
              <li>
                <code>expect(finder, findsOneWidget)</code> - Exactly one widget should be found
              </li>
              <li>
                <code>expect(finder, findsNothing)</code> - No widgets should be found
              </li>
              <li>
                <code>expect(finder, findsNWidgets(n))</code> - Exactly n widgets should be found
              </li>
              <li>
                <code>expect(finder, findsAtLeastNWidgets(n))</code> - At least n widgets should be found
              </li>
            </ul>

            <h3>Working with Asynchronous Widgets</h3>
            <p>
              When testing widgets that perform asynchronous operations, you need to use additional pumping methods:
            </p>
            <ul>
              <li>
                <code>await tester.pump()</code> - Trigger a rebuild
              </li>
              <li>
                <code>await tester.pumpAndSettle()</code> - Repeatedly pump until all animations and microtasks are
                complete
              </li>
              <li>
                <code>await tester.pump(Duration(seconds: 1))</code> - Wait for a specific duration before rebuilding
              </li>
            </ul>

            <h3>Golden Tests (Screenshot Tests)</h3>
            <p>Golden tests compare a widget's rendered appearance against a saved reference image:</p>
            <pre>
              <code>
                {`testWidgets('Counter golden test', (WidgetTester tester) async {
  await tester.pumpWidget(
    MaterialApp(
      home: Scaffold(
        body: CounterWidget(),
      ),
    ),
  );
  
  await expectLater(
    find.byType(CounterWidget),
    matchesGoldenFile('counter_widget.png'),
  );
});`}
              </code>
            </pre>
            <p>
              When you run this test for the first time, it creates the reference image. On subsequent runs, it compares
              the widget's appearance against this reference. If the appearance changes, the test fails.
            </p>
            <p>To update golden files when you intentionally change the UI:</p>
            <pre>
              <code>flutter test --update-goldens test/widgets/counter_widget_test.dart</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Integration Testing in Flutter</h2>
            <p>
              Integration tests verify that different parts of your app work correctly together. They run on a device or
              emulator and can simulate user interactions with the app.
            </p>

            <h3>Setting Up Integration Tests</h3>
            <p>Integration tests are set up differently from unit and widget tests:</p>
            <ol>
              <li>
                Add the <code>integration_test</code> package to your <code>pubspec.yaml</code>
              </li>
              <li>
                Create an <code>integration_test/</code> directory at the root of your project
              </li>
              <li>Create your test files in this directory</li>
            </ol>

            <h3>Basic Integration Test Structure</h3>
            <pre>
              <code>
                {`// integration_test/app_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:your_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('App Test', () {
    testWidgets('Full app flow test', (WidgetTester tester) async {
      // Start the app
      app.main();
      await tester.pumpAndSettle();
      
      // Verify initial screen
      expect(find.text('Welcome to YourApp'), findsOneWidget);
      
      // Navigate to the next screen
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle();
      
      // Verify navigation worked
      expect(find.text('Second Screen'), findsOneWidget);
      
      // Interact with elements on the second screen
      await tester.enterText(find.byType(TextField), 'test input');
      await tester.tap(find.byIcon(Icons.send));
      await tester.pumpAndSettle();
      
      // Verify the expected outcome
      expect(find.text('You entered: test input'), findsOneWidget);
    });
  });
}`}
              </code>
            </pre>

            <h3>Testing Complex Flows</h3>
            <p>Integration tests are ideal for testing user flows that span multiple screens:</p>
            <pre>
              <code>
                {`// integration_test/login_flow_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:your_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('Login Flow Test', () {
    testWidgets('should navigate from login to home screen', (WidgetTester tester) async {
      // Start the app
      app.main();
      await tester.pumpAndSettle();
      
      // Verify we're on the login screen
      expect(find.text('Login'), findsOneWidget);
      
      // Enter credentials
      await tester.enterText(
        find.byKey(Key('email_field')), 
        'test@example.com'
      );
      await tester.enterText(
        find.byKey(Key('password_field')), 
        'password123'
      );
      
      // Submit the form
      await tester.tap(find.byKey(Key('login_button')));
      
      // Wait for the login process and navigation
      await tester.pumpAndSettle();
      
      // Verify we're on the home screen
      expect(find.text('Welcome, Test User'), findsOneWidget);
      expect(find.text('Your Dashboard'), findsOneWidget);
      
      // Tap on a menu item
      await tester.tap(find.byKey(Key('profile_menu_item')));
      await tester.pumpAndSettle();
      
      // Verify navigation to profile screen
      expect(find.text('User Profile'), findsOneWidget);
      expect(find.text('test@example.com'), findsOneWidget);
    });
  });
}`}
              </code>
            </pre>

            <h3>Testing with Mocked Services</h3>
            <p>For integration tests, you often want to mock external services like APIs to:</p>
            <ul>
              <li>Make tests predictable and reliable</li>
              <li>Avoid hitting real servers during tests</li>
              <li>Test error scenarios that might be hard to reproduce with real services</li>
            </ul>
            <p>You can set up mocked services as part of your app initialization:</p>
            <pre>
              <code>
                {`// lib/main.dart
void main() {
  // In a real app, you would use dependency injection to provide the real services
  runApp(MyApp(
    userService: UserService(),
    authService: AuthService(),
  ));
}

// lib/main_test.dart
void mainTest() {
  // For testing, provide mocked services
  runApp(MyApp(
    userService: MockUserService(),
    authService: MockAuthService(),
  ));
}

// integration_test/app_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:your_app/main_test.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('App Test with Mocks', () {
    testWidgets('Login flow with mocked services', (tester) async {
      app.mainTest();  // Use the test entry point with mocks
      // Rest of the test...
    });
  });
}`}
              </code>
            </pre>

            <h3>Running Integration Tests</h3>
            <p>You can run integration tests in several ways:</p>
            <pre>
              <code>
                {`# Run directly on a connected device or emulator
flutter test integration_test/app_test.dart

# Run on multiple devices with flutter driver
flutter drive \
  --driver=test_driver/integration_test.dart \
  --target=integration_test/app_test.dart \
  -d all`}
              </code>
            </pre>
            <p>For the second approach, you need to create a driver file:</p>
            <pre>
              <code>
                {`// test_driver/integration_test.dart
import 'package:integration_test/integration_test_driver.dart';

Future<void> main() => integrationDriver();`}
              </code>
            </pre>

            <h3>Testing Performance</h3>
            <p>Integration tests can also be used to measure performance metrics:</p>
            <pre>
              <code>
                {`// integration_test/performance_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:your_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('Performance Tests', () {
    testWidgets('Measure scrolling performance', (WidgetTester tester) async {
      // Start the app
      app.main();
      await tester.pumpAndSettle();
      
      // Navigate to the list screen
      await tester.tap(find.byKey(Key('list_screen_button')));
      await tester.pumpAndSettle();
      
      // Record performance metrics during scrolling
      await IntegrationTestWidgetsFlutterBinding.instance.watchPerformance(() async {
        // Scroll the list several times
        for (int i = 0; i < 5; i++) {
          await tester.fling(
            find.byType(ListView), 
            Offset(0, -500), 
            3000
          );
          await tester.pumpAndSettle();
        }
      });
    });
  });
}`}
              </code>
            </pre>
            <p>Run it with the performance flag to get detailed metrics:</p>
            <pre>
              <code>
                {`flutter drive \
  --driver=test_driver/integration_test.dart \
  --target=integration_test/performance_test.dart \
  --profile  # Use --profile for performance measurements`}
              </code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Flutter Testing Best Practices</h2>
            <p>Following best practices ensures your tests are effective, maintainable, and provide maximum value.</p>

            <h3>General Testing Principles</h3>
            <ol>
              <li>
                <strong>Test Pyramid:</strong> Maintain a balance of tests, with more unit tests than widget tests, and
                more widget tests than integration tests.
              </li>
              <li>
                <strong>Single Responsibility:</strong> Each test should focus on verifying one specific aspect of
                functionality.
              </li>
              <li>
                <strong>Arrange-Act-Assert:</strong> Structure tests with clear setup, action, and verification phases.
              </li>
              <li>
                <strong>Independence:</strong> Tests should not depend on each other and should run in any order.
              </li>
              <li>
                <strong>Clean Setup/Teardown:</strong> Properly initialize and clean up resources for each test.
              </li>
            </ol>

            <h3>Test Data Management</h3>
            <ul>
              <li>
                <strong>Predictable Test Data:</strong> Use fixed test data rather than random or environment-dependent
                data.
              </li>
              <li>
                <strong>Factory Methods:</strong> Create helper methods for generating test entities.
              </li>
              <li>
                <strong>Avoid Duplication:</strong> Share setup code between tests, but be careful not to create
                dependencies.
              </li>
            </ul>
            <pre>
              <code>
                {`// Create test data generators
class TestData {
  static User createTestUser({
    String id = 'user-1',
    String name = 'Test User',
    int age = 30,
  }) {
    return User(id: id, name: name, age: age);
  }
  
  static List<Product> createTestProducts(int count) {
    return List.generate(count, (index) => 
      Product(
        id: 'product-$index',
        name: 'Product $index',
        price: 10.0 + index,
      ),
    );
  }
}`}
              </code>
            </pre>

            <h3>Mocking and Dependency Injection</h3>
            <ul>
              <li>
                <strong>Constructor Injection:</strong> Design classes to receive dependencies via constructor
                parameters.
              </li>
              <li>
                <strong>Interface-Based Design:</strong> Code against interfaces, not concrete implementations.
              </li>
              <li>
                <strong>Minimal Mocks:</strong> Mock only what's necessary for the test, using real implementations for
                the rest.
              </li>
            </ul>
            <pre>
              <code>
                {`// Instead of this:
class UserService {
  final _apiClient = ApiClient();
  
  Future<User> getUser(String id) async {
    // Uses _apiClient directly
  }
}

// Do this:
class UserService {
  final ApiClientInterface apiClient;
  
  UserService(this.apiClient);
  
  Future<User> getUser(String id) async {
    // Uses injected apiClient
  }
}`}
              </code>
            </pre>

            <h3>Widget Testing Tips</h3>
            <ul>
              <li>
                <strong>Use Keys for Important Widgets:</strong> Add keys to widgets you need to find in tests.
              </li>
              <li>
                <strong>Test Widget Boundaries:</strong> Focus on testing the widget's API, not its implementation
                details.
              </li>
              <li>
                <strong>Test Edge Cases:</strong> Empty states, error states, boundary conditions.
              </li>
              <li>
                <strong>Avoid Over-Specific Tests:</strong> Tests should be resilient to minor UI changes.
              </li>
            </ul>
            <pre>
              <code>
                {`// Adding keys to important widgets
ElevatedButton(
  key: Key('submit_button'),
  onPressed: _submitForm,
  child: Text('Submit'),
)

// In tests
await tester.tap(find.byKey(Key('submit_button')));`}
              </code>
            </pre>

            <h3>Integration Testing Tips</h3>
            <ul>
              <li>
                <strong>Focus on User Flows:</strong> Test complete features from the user's perspective.
              </li>
              <li>
                <strong>Stable Starting State:</strong> Ensure the app is in a known state at the start of each test.
              </li>
              <li>
                <strong>Handle Asynchronous Operations:</strong> Use pumpAndSettle() or carefully timed pumps.
              </li>
              <li>
                <strong>Mock External Dependencies:</strong> Use fake implementations for network, database, etc.
              </li>
            </ul>

            <h3>Testing for Accessibility</h3>
            <ul>
              <li>
                <strong>Semantic Labels:</strong> Verify that important widgets have proper semantic labels.
              </li>
              <li>
                <strong>Color Contrast:</strong> Ensure sufficient contrast between text and background.
              </li>
              <li>
                <strong>Widget Size:</strong> Check that interactive elements are large enough to tap.
              </li>
            </ul>
            <pre>
              <code>
                {`testWidgets('Buttons have semantic labels', (WidgetTester tester) async {
  await tester.pumpWidget(MyApp());
  
  // Verify that buttons have semantic labels
  expect(
    tester.getSemantics(find.byType(ElevatedButton)),
    matchesSemantics(label: 'Submit'),
  );
});`}
              </code>
            </pre>

            <h3>Continuous Integration</h3>
            <ul>
              <li>
                <strong>Run Tests on Every PR:</strong> Set up CI to run tests on every code change.
              </li>
              <li>
                <strong>Test Coverage:</strong> Monitor and maintain good test coverage.
              </li>
              <li>
                <strong>Visual Regression Testing:</strong> Use golden tests and screenshots in CI.
              </li>
              <li>
                <strong>Performance Testing:</strong> Monitor performance metrics over time.
              </li>
            </ul>
            <p>Example GitHub Actions workflow for Flutter tests:</p>
            <pre>
              <code>
                {`name: Flutter Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: subosito/flutter-action@v1
        with:
          flutter-version: '3.0.0'
      - run: flutter pub get
      - run: flutter test
      
  integration_test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: subosito/flutter-action@v1
        with:
          flutter-version: '3.0.0'
      - name: Start iOS Simulator
        run: |
          DEVICE_ID=$(xcrun xctrace list devices 2>&1 | grep -oE 'iPhone.*Simulator' | head -1 | sed 's/(.*//' | xargs)
          xcrun simctl boot "$DEVICE_ID"
      - run: flutter pub get
      - run: flutter test integration_test`}
              </code>
            </pre>

            <h3>Common Testing Pitfalls</h3>
            <ul>
              <li>
                <strong>Flaky Tests:</strong> Tests that sometimes pass and sometimes fail can erode confidence in the
                test suite.
              </li>
              <li>
                <strong>Over-Mocking:</strong> Excessive mocking can make tests brittle and less valuable.
              </li>
              <li>
                <strong>Testing Implementation Details:</strong> Focus on testing behavior, not implementation.
              </li>
              <li>
                <strong>Slow Tests:</strong> Long-running tests slow down the development cycle.
              </li>
              <li>
                <strong>Missing Edge Cases:</strong> Not testing error conditions and boundary cases.
              </li>
            </ul>

            <h3>Test-Driven Development (TDD) in Flutter</h3>
            <p>TDD can be an effective approach for Flutter development:</p>
            <ol>
              <li>
                <strong>Write a Failing Test:</strong> Start by writing a test that defines the expected behavior.
              </li>
              <li>
                <strong>Write Minimal Code:</strong> Implement just enough code to make the test pass.
              </li>
              <li>
                <strong>Refactor:</strong> Clean up the code while keeping tests passing.
              </li>
            </ol>
            <p>TDD works well for both business logic (with unit tests) and UI components (with widget tests).</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
