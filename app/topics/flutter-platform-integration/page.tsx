"use client"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FlutterPlatformIntegrationPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Flutter Platform Integration</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to integrate platform-specific code and features in your Flutter applications
        </p>
      </motion.div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platform-channels">Platform Channels</TabsTrigger>
          <TabsTrigger value="plugins">Plugin Development</TabsTrigger>
          <TabsTrigger value="platform-specific">Platform-Specific UI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Understanding Platform Integration in Flutter</h2>
            <p>
              Flutter provides a consistent way to develop applications across multiple platforms, but there are times
              when you need to access platform-specific features or APIs that aren't directly available through
              Flutter's cross-platform framework. Flutter offers several mechanisms to bridge the gap between your Dart
              code and platform-specific code:
            </p>

            <ul>
              <li>
                <strong>Platform Channels</strong>: Allow communication between Flutter (Dart) and platform-specific
                code (Android/iOS/Web/Desktop)
              </li>
              <li>
                <strong>Plugins</strong>: Reusable packages that wrap platform-specific functionality in a Dart API
              </li>
              <li>
                <strong>Platform-Specific UI</strong>: Ways to create UI components that adapt to look and behave
                natively on different platforms
              </li>
              <li>
                <strong>FFI (Foreign Function Interface)</strong>: Direct interaction with C/C++ code for
                high-performance operations
              </li>
            </ul>

            <p>
              Platform integration is essential for building apps that leverage the full capabilities of each platform
              while maintaining a single codebase.
            </p>

            <h3>When to Use Platform Integration</h3>
            <ul>
              <li>Accessing hardware features (camera, sensors, Bluetooth)</li>
              <li>Implementing platform-specific authentication (Touch ID, Face ID, fingerprint)</li>
              <li>Integrating with platform services (notifications, widgets, app shortcuts)</li>
              <li>Using native libraries or SDKs not available in pure Dart</li>
              <li>Optimizing performance for platform-specific operations</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="platform-channels" className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Platform Channels</h2>
            <p>
              Platform channels allow Flutter to communicate with platform-specific code. They provide a messaging
              system that passes messages between your Dart code and the host platform (Android, iOS, Web, etc.).
            </p>

            <h3>Types of Platform Channels</h3>
            <ol>
              <li>
                <strong>MethodChannel</strong>: For method calls (most common)
              </li>
              <li>
                <strong>EventChannel</strong>: For continuous event streams from the platform
              </li>
              <li>
                <strong>BasicMessageChannel</strong>: For custom message passing
              </li>
            </ol>

            <h3>Example: Basic MethodChannel Implementation</h3>
            <h4>Dart Side (Flutter)</h4>
            <pre>
              <code>
                {`// Create a method channel
final methodChannel = MethodChannel('com.example.app/battery');

// Call a platform method
Future<void> getBatteryLevel() async {
  try {
    final int batteryLevel = await methodChannel.invokeMethod('getBatteryLevel');
    setState(() {
      _batteryLevel = batteryLevel;
    });
  } on PlatformException catch (e) {
    _batteryLevel = -1;
  }
}`}
              </code>
            </pre>

            <h4>Native Side (Android - Kotlin)</h4>
            <pre>
              <code>
                {`// Set up method channel handler
private fun setupMethodChannel(flutterEngine: FlutterEngine) {
  MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "com.example.app/battery")
    .setMethodCallHandler { call, result ->
      if (call.method == "getBatteryLevel") {
        val batteryLevel = getBatteryLevel()
        result.success(batteryLevel)
      } else {
        result.notImplemented()
      }
    }
}

// Get battery level from Android
private fun getBatteryLevel(): Int {
  val batteryManager = getSystemService(BATTERY_SERVICE) as BatteryManager
  return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
}`}
              </code>
            </pre>

            <h4>Native Side (iOS - Swift)</h4>
            <pre>
              <code>
                {`// Set up method channel handler
private func setupMethodChannel(messenger: FlutterBinaryMessenger) {
  let channel = FlutterMethodChannel(name: "com.example.app/battery",
                                     binaryMessenger: messenger)
  channel.setMethodCallHandler { (call, result) in
    if call.method == "getBatteryLevel" {
      self.getBatteryLevel(result: result)
    } else {
      result(FlutterMethodNotImplemented)
    }
  }
}

// Get battery level from iOS
private func getBatteryLevel(result: FlutterResult) {
  let device = UIDevice.current
  device.isBatteryMonitoringEnabled = true
  
  if device.batteryState == UIDevice.BatteryState.unknown {
    result(FlutterError(code: "UNAVAILABLE",
                       message: "Battery level not available",
                       details: nil))
  } else {
    result(Int(device.batteryLevel * 100))
  }
}`}
              </code>
            </pre>

            <h3>Passing Complex Data</h3>
            <p>Platform channels support the following data types:</p>
            <ul>
              <li>null</li>
              <li>bool</li>
              <li>int</li>
              <li>double</li>
              <li>String</li>
              <li>Uint8List (Dart) / byte[] (Java) / NSData (iOS)</li>
              <li>Int32List (Dart) / int[] (Java) / NSArray of NSNumber (iOS)</li>
              <li>Int64List (Dart) / long[] (Java) / NSArray of NSNumber (iOS)</li>
              <li>Float64List (Dart) / double[] (Java) / NSArray of NSNumber (iOS)</li>
              <li>List (Dart) / ArrayList (Java) / NSArray (iOS)</li>
              <li>Map (Dart) / HashMap (Java) / NSDictionary (iOS)</li>
            </ul>

            <p>
              For more complex objects, you'll need to serialize/deserialize them, typically using JSON or another
              serialization format.
            </p>

            <h3>EventChannel for Continuous Events</h3>
            <p>
              EventChannels are used when you need to listen to continuous events from the platform, such as sensor data
              or connectivity changes.
            </p>

            <h4>Dart Side (Flutter)</h4>
            <pre>
              <code>
                {`// Create an event channel
final eventChannel = EventChannel('com.example.app/accelerometer');

// Listen to the event stream
StreamSubscription<dynamic>? _streamSubscription;

void startListening() {
  _streamSubscription = eventChannel.receiveBroadcastStream().listen(
    (dynamic event) {
      setState(() {
        _accelerometerValues = event;
      });
    },
    onError: (dynamic error) {
      print('Error: \$error');
    }
  );
}

@override
void dispose() {
  _streamSubscription?.cancel();
  super.dispose();
}`}
              </code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="plugins" className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Flutter Plugin Development</h2>
            <p>
              Plugins are packages that include platform-specific code. They provide a way to access platform features
              and APIs through a Dart interface.
            </p>

            <h3>Creating a Flutter Plugin</h3>
            <p>Flutter provides a template for creating plugins:</p>
            <pre>
              <code>{`flutter create --org com.example --template=plugin my_plugin`}</code>
            </pre>

            <p>This creates a plugin project with the following structure:</p>
            <pre>
              <code>
                {`my_plugin/
  lib/ - Dart code
  android/ - Android-specific code
  ios/ - iOS-specific code
  example/ - Example Flutter app using the plugin`}
              </code>
            </pre>

            <h3>Implementing a Basic Plugin</h3>
            <p>Here's a simplified example of implementing a geolocation plugin:</p>

            <h4>Dart Interface (lib/my_location_plugin.dart)</h4>
            <pre>
              <code>
                {`import 'dart:async';
import 'package:flutter/services.dart';

class MyLocationPlugin {
  static const MethodChannel _channel = MethodChannel('my_location_plugin');

  static Future<Map<String, double>> getCurrentLocation() async {
    final Map<dynamic, dynamic> result = await _channel.invokeMethod('getCurrentLocation');
    return {
      'latitude': result['latitude'],
      'longitude': result['longitude'],
    };
  }
}`}
              </code>
            </pre>

            <h4>Android Implementation (android/src/main/kotlin/.../MyLocationPlugin.kt)</h4>
            <pre>
              <code>
                {`class MyLocationPlugin: FlutterPlugin, MethodCallHandler {
  private lateinit var channel: MethodChannel
  private lateinit var context: Context

  override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
    channel = MethodChannel(binding.binaryMessenger, "my_location_plugin")
    channel.setMethodCallHandler(this)
    context = binding.applicationContext
  }

  override fun onMethodCall(call: MethodCall, result: Result) {
    if (call.method == "getCurrentLocation") {
      // Get location using Android LocationManager or FusedLocationProvider
      // For this example, just return dummy data
      val locationMap = HashMap<String, Double>()
      locationMap["latitude"] = 37.7749
      locationMap["longitude"] = -122.4194
      result.success(locationMap)
    } else {
      result.notImplemented()
    }
  }

  override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
    channel.setMethodCallHandler(null)
  }
}`}
              </code>
            </pre>

            <h4>iOS Implementation (ios/Classes/SwiftMyLocationPlugin.swift)</h4>
            <pre>
              <code>
                {`public class SwiftMyLocationPlugin: NSObject, FlutterPlugin {
  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(name: "my_location_plugin", binaryMessenger: registrar.messenger())
    let instance = SwiftMyLocationPlugin()
    registrar.addMethodCallDelegate(instance, channel: channel)
  }

  public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    if call.method == "getCurrentLocation" {
      // Get location using iOS CoreLocation
      // For this example, just return dummy data
      let locationMap: [String: Double] = [
        "latitude": 37.7749,
        "longitude": -122.4194
      ]
      result(locationMap)
    } else {
      result(FlutterMethodNotImplemented)
    }
  }
}`}
              </code>
            </pre>

            <h3>Publishing a Plugin</h3>
            <p>Once your plugin is ready, you can publish it to pub.dev for others to use:</p>
            <ol>
              <li>Update the pubspec.yaml with proper metadata</li>
              <li>Document your plugin with examples and API docs</li>
              <li>Run flutter pub publish to publish to pub.dev</li>
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="platform-specific" className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Platform-Specific UI</h2>
            <p>
              Flutter provides ways to create platform-specific UI elements to maintain a native look and feel on
              different platforms.
            </p>

            <h3>Platform Detection</h3>
            <pre>
              <code>
                {`import 'dart:io' show Platform;

if (Platform.isAndroid) {
  // Android-specific code
} else if (Platform.isIOS) {
  // iOS-specific code
} else if (Platform.isMacOS) {
  // macOS-specific code
} else if (Platform.isWindows) {
  // Windows-specific code
} else if (Platform.isLinux) {
  // Linux-specific code
} else if (Platform.isFuchsia) {
  // Fuchsia-specific code
}`}
              </code>
            </pre>

            <p>For web platforms:</p>
            <pre>
              <code>
                {`import 'package:flutter/foundation.dart' show kIsWeb;

if (kIsWeb) {
  // Web-specific code
}`}
              </code>
            </pre>

            <h3>Using Cupertino (iOS-style) Widgets</h3>
            <pre>
              <code>
                {`import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class PlatformAdaptiveApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      return CupertinoApp(
        home: CupertinoPageScaffold(
          navigationBar: CupertinoNavigationBar(
            middle: Text('iOS App'),
          ),
          child: Center(
            child: Text('Hello iOS!'),
          ),
        ),
      );
    } else {
      return MaterialApp(
        home: Scaffold(
          appBar: AppBar(
            title: Text('Android App'),
          ),
          body: Center(
            child: Text('Hello Android!'),
          ),
        ),
      );
    }
  }
}`}
              </code>
            </pre>

            <h3>Platform-Adaptive Widgets</h3>
            <p>You can create platform-adaptive widgets that automatically use the appropriate style:</p>
            <pre>
              <code>
                {`class PlatformButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  PlatformButton({required this.text, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      return CupertinoButton(
        child: Text(text),
        onPressed: onPressed,
      );
    } else {
      return ElevatedButton(
        child: Text(text),
        onPressed: onPressed,
      );
    }
  }
}`}
              </code>
            </pre>

            <h3>Platform-Specific Behavior</h3>
            <p>Sometimes, you need to implement different behaviors rather than just different UI elements:</p>
            <pre>
              <code>
                {`void shareFunctionality() {
  if (Platform.isIOS) {
    // Use UIActivityViewController
  } else if (Platform.isAndroid) {
    // Use Intent.ACTION_SEND
  } else {
    // Fallback for other platforms
  }
}`}
              </code>
            </pre>

            <h3>Third-Party Packages for Platform Adaptation</h3>
            <p>Several packages can help with platform-specific adaptations:</p>
            <ul>
              <li>flutter_platform_widgets - Provides platform-adaptive widgets</li>
              <li>adaptive_theme - For platform-specific theming</li>
              <li>platform_detect - Enhanced platform detection</li>
            </ul>

            <h3>Best Practices for Platform Integration</h3>
            <ol>
              <li>Use platform channels only when necessary - prefer Dart/Flutter solutions when available</li>
              <li>Abstract platform code behind a common Dart interface</li>
              <li>Handle platform-specific error cases and permissions</li>
              <li>Test on all target platforms</li>
              <li>Consider using existing plugins before writing your own platform code</li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
