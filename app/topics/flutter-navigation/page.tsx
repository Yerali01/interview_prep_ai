"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function FlutterNavigationPage() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-12"
    >
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/topics")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Topics
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DifficultyBadge level="middle" />
            <span className="text-sm text-muted-foreground">35 min read</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl font-bold"
          >
            Flutter Navigation System
          </motion.h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/quiz/flutter-navigation-quiz">Take Quiz</Link>
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="prose prose-invert max-w-none dark:prose-invert">
              <h2>Overview</h2>
              <p>
                Navigation is a fundamental aspect of Flutter applications. Understanding the different navigation
                approaches and patterns is essential for creating intuitive and efficient user experiences. This topic
                covers everything from basic navigation to advanced routing techniques.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3>Basic Navigation with Navigator 1.0</h3>
                <p>
                  Flutter's basic navigation system uses the Navigator widget, which manages a stack of Route objects.
                  You can use Navigator.push() to add a new route to the stack and Navigator.pop() to remove the current
                  route.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// Navigate to a new screen
void navigateToDetails(BuildContext context) {
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => DetailsScreen(),
    ),
  );
}

// Go back to the previous screen
void goBack(BuildContext context) {
  Navigator.pop(context);
}

// Example usage in a widget
ElevatedButton(
  onPressed: () => navigateToDetails(context),
  child: Text('View Details'),
)`}</code>
                </pre>
                <p>This imperative approach is simple but can become complex for deep navigation structures.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h3>Named Routes</h3>
                <p>
                  Named routes allow you to define routes by name in your MaterialApp or CupertinoApp. You can then
                  navigate to these routes using Navigator.pushNamed().
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// Define routes in MaterialApp
MaterialApp(
  routes: {
    '/': (context) => HomeScreen(),
    '/details': (context) => DetailsScreen(),
    '/settings': (context) => SettingsScreen(),
  },
  initialRoute: '/',
);

// Navigate using named routes
void navigateToDetails(BuildContext context) {
  Navigator.pushNamed(context, '/details');
}

// Navigate with arguments
void navigateToDetailsWithArgs(BuildContext context) {
  Navigator.pushNamed(
    context,
    '/details',
    arguments: {'id': 123, 'title': 'Product Details'},
  );
}

// Accessing arguments in the destination screen
class DetailsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
    final id = args['id'];
    final title = args['title'];
    
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text('ID: $id')),
    );
  }
}`}</code>
                </pre>
                <p>This approach is more declarative and makes it easier to manage routes in larger applications.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h3>Advanced Named Routes with onGenerateRoute</h3>
                <p>
                  For more complex routing needs, you can use the onGenerateRoute parameter in MaterialApp. This
                  function is called when the app navigates to a named route that isn't defined in the routes parameter.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`MaterialApp(
  onGenerateRoute: (settings) {
    // Handle '/details/:id' routes
    if (settings.name?.startsWith('/details/') ?? false) {
      final id = settings.name!.split('/').last;
      return MaterialPageRoute(
        builder: (context) => DetailsScreen(id: id),
      );
    }
    
    // Handle other routes
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (context) => HomeScreen());
      case '/settings':
        return MaterialPageRoute(builder: (context) => SettingsScreen());
      default:
        return MaterialPageRoute(builder: (context) => NotFoundScreen());
    }
  },
  initialRoute: '/',
);

// Navigate with dynamic route
Navigator.pushNamed(context, '/details/123');`}</code>
                </pre>
                <p>This approach allows for dynamic route generation based on the route name and arguments.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <h3>Navigator 2.0</h3>
                <p>
                  Navigator 2.0 (also called the Router API) provides a more declarative approach to navigation. It uses
                  a Router widget with a RouterDelegate that builds the Navigator based on the current RouteInformation.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerDelegate: MyRouterDelegate(),
      routeInformationParser: MyRouteInformationParser(),
    );
  }
}

class MyRouterDelegate extends RouterDelegate<RouteInformation>
    with ChangeNotifier, PopNavigatorRouterDelegateMixin<RouteInformation> {
  @override
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
  
  String? _selectedProductId;
  bool _showSettings = false;
  
  @override
  Widget build(BuildContext context) {
    return Navigator(
      key: navigatorKey,
      pages: [
        MaterialPage(
          key: ValueKey('home'),
          child: HomeScreen(
            onProductSelected: (id) {
              _selectedProductId = id;
              notifyListeners();
            },
            onSettingsTapped: () {
              _showSettings = true;
              notifyListeners();
            },
          ),
        ),
        if (_selectedProductId != null)
          MaterialPage(
            key: ValueKey('product-$_selectedProductId'),
            child: ProductScreen(id: _selectedProductId!),
          ),
        if (_showSettings)
          MaterialPage(
            key: ValueKey('settings'),
            child: SettingsScreen(),
          ),
      ],
      onPopPage: (route, result) {
        if (!route.didPop(result)) {
          return false;
        }
        
        if (_showSettings) {
          _showSettings = false;
        } else if (_selectedProductId != null) {
          _selectedProductId = null;
        }
        
        notifyListeners();
        return true;
      },
    );
  }
  
  // Other required methods...
}`}</code>
                </pre>
                <p>This approach is more complex but provides better support for deep linking and web navigation.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <h3>Navigation Patterns</h3>
                <p>Common navigation patterns in Flutter include:</p>
                <ul>
                  <li>
                    <strong>Bottom Navigation:</strong> Using BottomNavigationBar for switching between main sections of
                    the app.
                  </li>
                  <li>
                    <strong>Drawer Navigation:</strong> Using Drawer for accessing less frequently used sections.
                  </li>
                  <li>
                    <strong>Tab Navigation:</strong> Using TabBar and TabBarView for related content sections.
                  </li>
                  <li>
                    <strong>Nested Navigation:</strong> Having multiple navigators for different sections of the app.
                  </li>
                </ul>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// Bottom Navigation Example
class BottomNavExample extends StatefulWidget {
  @override
  _BottomNavExampleState createState() => _BottomNavExampleState();
}

class _BottomNavExampleState extends State<BottomNavExample> {
  int _selectedIndex = 0;
  
  final List<Widget> _screens = [
    HomeScreen(),
    SearchScreen(),
    ProfileScreen(),
  ];
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <h3>Passing Data Between Screens</h3>
                <p>There are several ways to pass data between screens in Flutter:</p>
                <ol>
                  <li>
                    <strong>Constructor Parameters:</strong> Pass data directly to the constructor of the destination
                    screen.
                  </li>
                  <li>
                    <strong>Named Route Arguments:</strong> Pass data as arguments when using named routes.
                  </li>
                  <li>
                    <strong>State Management:</strong> Use a state management solution like Provider, Riverpod, or Bloc.
                  </li>
                  <li>
                    <strong>Return Values:</strong> Get data back from a screen using Navigator.pop().
                  </li>
                </ol>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// 1. Constructor Parameters
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => DetailsScreen(product: product),
  ),
);

// 2. Named Route Arguments
Navigator.pushNamed(
  context,
  '/details',
  arguments: product,
);

// In the destination screen
final product = ModalRoute.of(context)!.settings.arguments as Product;

// 3. State Management (Provider example)
Provider.of<ProductProvider>(context, listen: false).setSelectedProduct(product);

// 4. Return Values
final result = await Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SelectionScreen()),
);

// In the destination screen
Navigator.pop(context, 'Selected item');`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <h3>Popular Navigation Packages</h3>
                <p>Several packages simplify navigation in Flutter:</p>
                <ul>
                  <li>
                    <strong>go_router:</strong> A declarative routing package that supports deep linking and nested
                    navigation.
                  </li>
                  <li>
                    <strong>auto_route:</strong> A code generation package that reduces boilerplate for navigation.
                  </li>
                  <li>
                    <strong>get:</strong> A comprehensive package that includes navigation, state management, and
                    dependency injection.
                  </li>
                </ul>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// go_router example
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
      routes: [
        GoRoute(
          path: 'details/:id',
          builder: (context, state) {
            final id = state.params['id']!;
            return DetailsScreen(id: id);
          },
        ),
        GoRoute(
          path: 'settings',
          builder: (context, state) => SettingsScreen(),
        ),
      ],
    ),
  ],
);

// Using the router
MaterialApp.router(
  routerConfig: router,
);

// Navigation with go_router
context.go('/details/123');
context.go('/settings');`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <h3>Nested Navigation</h3>
                <p>
                  Nested navigation involves having multiple navigators in your app, each managing its own stack of
                  routes. This is common in apps with bottom navigation bars or tabs, where each tab has its own
                  navigation history.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`class NestedNavigationExample extends StatefulWidget {
  @override
  _NestedNavigationExampleState createState() => _NestedNavigationExampleState();
}

class _NestedNavigationExampleState extends State<NestedNavigationExample> {
  int _selectedIndex = 0;
  
  final List<GlobalKey<NavigatorState>> _navigatorKeys = [
    GlobalKey<NavigatorState>(),
    GlobalKey<NavigatorState>(),
    GlobalKey<NavigatorState>(),
  ];
  
  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        final isFirstRouteInCurrentTab = 
            !await _navigatorKeys[_selectedIndex].currentState!.maybePop();
            
        if (isFirstRouteInCurrentTab) {
          if (_selectedIndex != 0) {
            // Select home tab when back button is pressed on a different tab
            setState(() {
              _selectedIndex = 0;
            });
            return false;
          }
        }
        
        // Let system handle back button if we're on the first route
        return isFirstRouteInCurrentTab;
      },
      child: Scaffold(
        body: Stack(
          children: [
            _buildOffstageNavigator(0),
            _buildOffstageNavigator(1),
            _buildOffstageNavigator(2),
          ],
        ),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) {
            setState(() {
              _selectedIndex = index;
            });
          },
          items: [
            BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
            BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
          ],
        ),
      ),
    );
  }
  
  Widget _buildOffstageNavigator(int index) {
    return Offstage(
      offstage: _selectedIndex != index,
      child: Navigator(
        key: _navigatorKeys[index],
        onGenerateRoute: (settings) {
          return MaterialPageRoute(
            builder: (context) {
              switch (index) {
                case 0:
                  return HomeScreen();
                case 1:
                  return SearchScreen();
                case 2:
                  return ProfileScreen();
                default:
                  return HomeScreen();
              }
            },
          );
        },
      ),
    );
  }
}`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <h3>Animations and Transitions</h3>
                <p>
                  Flutter provides built-in transitions for route changes, and you can create custom transitions using
                  PageRouteBuilder or custom Route classes.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// Custom page route with slide transition
class SlideRightRoute extends PageRouteBuilder {
  final Widget page;
  
  SlideRightRoute({required this.page})
      : super(
          pageBuilder: (context, animation, secondaryAnimation) => page,
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            const begin = Offset(-1.0, 0.0);
            const end = Offset.zero;
            const curve = Curves.easeInOut;
            
            var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
            var offsetAnimation = animation.drive(tween);
            
            return SlideTransition(
              position: offsetAnimation,
              child: child,
            );
          },
        );
}

// Using the custom route
Navigator.push(
  context,
  SlideRightRoute(page: DetailsScreen()),
);

// Using PageRouteBuilder directly
Navigator.push(
  context,
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => DetailsScreen(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: animation,
        child: child,
      );
    },
  ),
);`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
              >
                <h3>Deep Linking</h3>
                <p>
                  Deep linking allows users to navigate directly to specific content in your app from outside sources
                  like web links or notifications.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// Android setup (AndroidManifest.xml)
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="myapp" android:host="products" />
</intent-filter>

// iOS setup (Info.plist)
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>com.example.myapp</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>

// Handling deep links with uni_links package
import 'package:uni_links/uni_links.dart';

Future<void> initUniLinks() async {
  // Handle app start from deep link
  final initialLink = await getInitialLink();
  if (initialLink != null) {
    handleDeepLink(initialLink);
  }
  
  // Handle deep links when app is already running
  linkStream.listen((String? link) {
    if (link != null) {
      handleDeepLink(link);
    }
  });
}

void handleDeepLink(String link) {
  final uri = Uri.parse(link);
  if (uri.host == 'products' && uri.pathSegments.isNotEmpty) {
    final productId = uri.pathSegments.first;
    navigateToProduct(productId);
  }
}`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                <h3>Best Practices for Navigation in Flutter</h3>
                <p>Here are some best practices to follow when implementing navigation in Flutter:</p>
                <ul>
                  <li>Use named routes for better organization in larger apps.</li>
                  <li>Consider using a navigation package for complex navigation requirements.</li>
                  <li>Implement proper back button handling, especially with nested navigation.</li>
                  <li>Use transitions that match your app's design language.</li>
                  <li>Handle deep links for better user experience.</li>
                  <li>Test navigation flows thoroughly, including edge cases.</li>
                  <li>Consider accessibility when designing navigation patterns.</li>
                  <li>Use a consistent navigation pattern throughout your app.</li>
                </ul>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Related Topics</h2>
        <Button asChild variant="ghost">
          <Link href="/topics">View All Topics</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Link href="/topics/custom-painter-clipper">
            <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">CustomPainter and CustomClipper</h3>
                  <DifficultyBadge level="middle" />
                </div>
                <p className="text-muted-foreground">Creating custom shapes and graphics in Flutter</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Link href="/topics/state-management">
            <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">State Management</h3>
                  <DifficultyBadge level="middle" />
                </div>
                <p className="text-muted-foreground">Different approaches to manage state in Flutter applications</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Link href="/topics/architecture-patterns">
            <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Architecture Patterns</h3>
                  <DifficultyBadge level="senior" />
                </div>
                <p className="text-muted-foreground">Designing scalable and maintainable Flutter applications</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

function DifficultyBadge({ level }: { level: "junior" | "middle" | "senior" }) {
  const colors = {
    junior: "bg-green-500/20 text-green-400 border-green-500/30",
    middle: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    senior: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  }

  const labels = {
    junior: "Junior",
    middle: "Middle",
    senior: "Senior",
  }

  return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>{labels[level]}</span>
}
