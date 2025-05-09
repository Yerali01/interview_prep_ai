export const roadmapData = {
  levels: [
    {
      id: "junior",
      title: "Junior Flutter Developer",
      description: "Foundation & Fundamentals (0-12 months)",
      icon: "BookOpen",
      color: "green",
      sections: [
        {
          title: "Dart Programming Language",
          importance: "Essential",
          topics: [
            { name: "Dart Basics", link: "/topics/dart-fundamentals" },
            { name: "Variables & Types", link: "/topics/dart-fundamentals" },
            { name: "Control Flow", link: "/topics/dart-fundamentals" },
            { name: "Functions", link: "/topics/dart-fundamentals" },
            { name: "Collections", link: "/topics/dart-fundamentals" },
            { name: "Object-Oriented Programming", link: "/topics/dart-fundamentals" },
            { name: "Null Safety", link: "/topics/dart-fundamentals" },
          ],
        },
        {
          title: "Flutter Basics",
          importance: "Essential",
          topics: [
            { name: "Flutter Introduction", link: "/topics/flutter-basics" },
            { name: "Project Structure", link: "/topics/flutter-basics" },
            { name: "Widgets Overview", link: "/topics/flutter-widgets" },
            { name: "Basic Layouts", link: "/topics/flutter-widgets" },
            { name: "Stateless Widgets", link: "/topics/flutter-widgets" },
            { name: "Stateful Widgets", link: "/topics/flutter-widgets" },
            { name: "Basic State Management", link: "/topics/state-management" },
          ],
        },
        {
          title: "UI Components & Styling",
          importance: "Essential",
          topics: [
            { name: "Text & Typography", link: "/topics/flutter-widgets" },
            { name: "Buttons & Inputs", link: "/topics/flutter-widgets" },
            { name: "Images & Assets", link: "/topics/flutter-widgets" },
            { name: "Lists & Grids", link: "/topics/flutter-widgets" },
            { name: "App Bar & Navigation", link: "/topics/navigation-routing" },
            { name: "Dialogs & Modals", link: "/topics/flutter-widgets" },
            { name: "Theming & Styling", link: "/topics/flutter-widgets" },
          ],
        },
        {
          title: "Basic Navigation & State Management",
          importance: "Essential",
          topics: [
            { name: "setState", link: "/topics/state-management" },
            { name: "Basic Navigation", link: "/topics/navigation-routing" },
            { name: "Route Management", link: "/topics/navigation-routing" },
            { name: "Passing Data Between Screens", link: "/topics/navigation-routing" },
            { name: "InheritedWidget", link: "/topics/state-management" },
            { name: "Introduction to Provider", link: "/topics/state-management" },
          ],
        },
        {
          title: "Basic Data Management",
          importance: "Essential",
          topics: [
            { name: "JSON Parsing", link: "/topics/async-programming" },
            { name: "Basic HTTP Requests", link: "/topics/async-programming" },
            { name: "Async/Await", link: "/topics/async-programming" },
            { name: "SharedPreferences", link: "/topics/async-programming" },
            { name: "Form Handling", link: "/topics/flutter-widgets" },
          ],
        },
        {
          title: "Dev Tools & Debugging",
          importance: "Important",
          topics: [
            { name: "Flutter DevTools", link: "/topics/flutter-basics" },
            { name: "Hot Reload/Restart", link: "/topics/flutter-basics" },
            { name: "Debugging Techniques", link: "/topics/flutter-basics" },
            { name: "Dart Analyzer", link: "/topics/dart-fundamentals" },
          ],
        },
      ],
      projects: [
        {
          title: "To-Do List App",
          description: "Build a simple task manager with basic CRUD operations.",
          skills: ["UI Components", "setState", "SharedPreferences"],
        },
        {
          title: "Weather App",
          description: "Create an app that fetches and displays weather data.",
          skills: ["HTTP Requests", "JSON Parsing", "Async/Await"],
        },
        {
          title: "Recipe Book",
          description: "Develop an app to browse and view cooking recipes.",
          skills: ["Lists", "Navigation", "Basic State Management"],
        },
      ],
    },
    {
      id: "middle",
      title: "Middle Flutter Developer",
      description: "Advanced Concepts & Best Practices (1-2 years)",
      icon: "Code",
      color: "blue",
      sections: [
        {
          title: "Advanced Dart Programming",
          importance: "Essential",
          topics: [
            { name: "Asynchronous Programming", link: "/topics/async-programming" },
            { name: "Streams & Futures", link: "/topics/async-programming" },
            { name: "Generics", link: "/topics/dart-fundamentals" },
            { name: "Collections in Depth", link: "/topics/dart-fundamentals" },
            { name: "Extension Methods", link: "/topics/dart-fundamentals" },
            { name: "Isolates & Concurrency", link: "/topics/async-programming" },
          ],
        },
        {
          title: "Advanced State Management",
          importance: "Essential",
          topics: [
            { name: "Provider (In Depth)", link: "/topics/state-management" },
            { name: "Riverpod", link: "/topics/state-management" },
            { name: "BLoC Pattern", link: "/topics/state-management" },
            { name: "Redux", link: "/topics/state-management" },
            { name: "GetX", link: "/topics/state-management" },
            { name: "MobX", link: "/topics/state-management" },
          ],
        },
        {
          title: "Advanced Navigation & Routing",
          importance: "Essential",
          topics: [
            { name: "Named Routes", link: "/topics/navigation-routing" },
            { name: "Navigation 2.0", link: "/topics/navigation-routing" },
            { name: "GoRouter", link: "/topics/navigation-routing" },
            { name: "Auto Route", link: "/topics/navigation-routing" },
            { name: "Deep Linking", link: "/topics/navigation-routing" },
            { name: "Web URLs", link: "/topics/navigation-routing" },
          ],
        },
        {
          title: "Data Management & APIs",
          importance: "Essential",
          topics: [
            { name: "RESTful APIs", link: "/topics/async-programming" },
            { name: "GraphQL", link: "/topics/async-programming" },
            { name: "Dio & Http Client", link: "/topics/async-programming" },
            { name: "Local Database (SQLite)", link: "/topics/async-programming" },
            { name: "Firebase Integration", link: "/topics/async-programming" },
            { name: "Caching Strategies", link: "/topics/performance-optimization" },
          ],
        },
        {
          title: "UI/UX & Animations",
          importance: "Essential",
          topics: [
            { name: "Custom Animations", link: "/topics/advanced-animations" },
            { name: "Implicit Animations", link: "/topics/advanced-animations" },
            { name: "Explicit Animations", link: "/topics/advanced-animations" },
            { name: "Custom Painters", link: "/topics/custom-painter-clipper" },
            { name: "Custom Clippers", link: "/topics/custom-painter-clipper" },
            { name: "Responsive Design", link: "/topics/performance-optimization" },
            { name: "Internationalization", link: "/topics/flutter-internationalization" },
          ],
        },
        {
          title: "Testing & Architecture",
          importance: "Important",
          topics: [
            { name: "Unit Testing", link: "/topics/flutter-testing-strategies" },
            { name: "Widget Testing", link: "/topics/flutter-testing-strategies" },
            { name: "Integration Testing", link: "/topics/flutter-testing-strategies" },
            { name: "MVVM Pattern", link: "/topics/architecture-patterns" },
            { name: "Repository Pattern", link: "/topics/architecture-patterns" },
            { name: "Dependency Injection", link: "/topics/architecture-patterns" },
          ],
        },
        {
          title: "Package & Plugin Development",
          importance: "Useful",
          topics: [
            { name: "Creating Flutter Packages", link: "/topics/flutter-plugin-development" },
            { name: "Publishing to pub.dev", link: "/topics/flutter-plugin-development" },
            { name: "Platform Channels", link: "/topics/flutter-plugin-development" },
            { name: "Native Plugin Development", link: "/topics/flutter-plugin-development" },
          ],
        },
      ],
      projects: [
        {
          title: "E-commerce App",
          description: "Build a complete e-commerce app with product listings, cart, and checkout.",
          skills: ["State Management", "APIs", "Navigation"],
        },
        {
          title: "Social Media App",
          description: "Create a social media app with feeds, profiles, and real-time updates.",
          skills: ["Firebase", "Streams", "UI/UX"],
        },
        {
          title: "Task Management System",
          description: "Develop a productivity app with complex state and data persistence.",
          skills: ["Database", "State Management", "Architecture"],
        },
      ],
    },
    {
      id: "senior",
      title: "Senior Flutter Developer",
      description: "Mastery & Leadership (2+ years)",
      icon: "Zap",
      color: "purple",
      sections: [
        {
          title: "Performance Optimization",
          importance: "Essential",
          topics: [
            { name: "Memory Management", link: "/topics/performance-optimization" },
            { name: "Widget Rebuilds", link: "/topics/performance-optimization" },
            { name: "Render Optimization", link: "/topics/performance-optimization" },
            { name: "App Size Reduction", link: "/topics/performance-optimization" },
            { name: "Profiling & Benchmarking", link: "/topics/performance-optimization" },
            { name: "Frame Rate Optimization", link: "/topics/performance-optimization" },
          ],
        },
        {
          title: "Advanced Architecture",
          importance: "Essential",
          topics: [
            { name: "Clean Architecture", link: "/topics/architecture-patterns" },
            { name: "Domain-Driven Design", link: "/topics/architecture-patterns" },
            { name: "Design Patterns in Flutter", link: "/topics/architecture-patterns" },
            { name: "Scalable Project Structure", link: "/topics/architecture-patterns" },
            { name: "Microservices Integration", link: "/topics/architecture-patterns" },
            { name: "Monorepo Strategies", link: '/topics  link: "/topics/architecture-patterns' },
            { name: "Monorepo Strategies", link: "/topics/architecture-patterns" },
          ],
        },
        {
          title: "Advanced Animations & Graphics",
          importance: "Essential",
          topics: [
            { name: "Custom Animation Controllers", link: "/topics/advanced-animations" },
            { name: "Complex Animation Sequences", link: "/topics/advanced-animations" },
            { name: "Physics-Based Animations", link: "/topics/advanced-animations" },
            { name: "Gesture-Driven Animations", link: "/topics/advanced-animations" },
            { name: "3D Effects & Rendering", link: "/topics/advanced-animations" },
            { name: "Canvas & Custom Rendering", link: "/topics/custom-painter-clipper" },
          ],
        },
        {
          title: "Platform Integration & Features",
          importance: "Important",
          topics: [
            { name: "Advanced Platform Channels", link: "/topics/flutter-platform-integration" },
            { name: "Native APIs Integration", link: "/topics/flutter-platform-integration" },
            { name: "Platform-Specific UIs", link: "/topics/flutter-platform-integration" },
            { name: "Background Processing", link: "/topics/flutter-platform-integration" },
            { name: "Push Notifications", link: "/topics/flutter-platform-integration" },
            { name: "Hardware Feature Access", link: "/topics/flutter-platform-integration" },
          ],
        },
        {
          title: "Advanced Testing & CI/CD",
          importance: "Important",
          topics: [
            { name: "Test-Driven Development", link: "/topics/flutter-testing-strategies" },
            { name: "BDD with Cucumber", link: "/topics/flutter-testing-strategies" },
            { name: "Mocking & Test Doubles", link: "/topics/flutter-testing-strategies" },
            { name: "Continuous Integration", link: "/topics/flutter-testing-strategies" },
            { name: "Automated Deployment", link: "/topics/flutter-testing-strategies" },
            { name: "Feature Flagging", link: "/topics/flutter-testing-strategies" },
          ],
        },
        {
          title: "Advanced Development Ecosystem",
          importance: "Useful",
          topics: [
            { name: "Code Generation", link: "/topics/architecture-patterns" },
            { name: "Custom CLI Tools", link: "/topics/architecture-patterns" },
            { name: "Build Automation", link: "/topics/architecture-patterns" },
            { name: "Advanced Git Workflows", link: "/topics/architecture-patterns" },
            { name: "Analytics & Monitoring", link: "/topics/architecture-patterns" },
            { name: "Crash Reporting Systems", link: "/topics/architecture-patterns" },
          ],
        },
        {
          title: "Leadership & Technical Direction",
          importance: "Important",
          topics: [
            { name: "Technical Leadership", link: "#" },
            { name: "Code Reviews", link: "#" },
            { name: "Mentoring Junior Devs", link: "#" },
            { name: "Architectural Decision", link: "#" },
            { name: "Technical Documentation", link: "#" },
            { name: "Team Collaboration", link: "#" },
          ],
        },
      ],
      projects: [
        {
          title: "Enterprise App with Microservices",
          description: "Build a complex enterprise app with multiple services and advanced architecture.",
          skills: ["Clean Architecture", "Performance", "CI/CD"],
        },
        {
          title: "Cross-Platform Framework",
          description: "Create a framework or SDK for solving complex problems in Flutter ecosystem.",
          skills: ["Packages", "Architecture", "APIs"],
        },
        {
          title: "AR/VR Experience",
          description: "Develop an immersive AR/VR experience with Flutter and platform integrations.",
          skills: ["Platform Channels", "3D Rendering", "Complex UI"],
        },
      ],
    },
  ],
}

export default roadmapData
