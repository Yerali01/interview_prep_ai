"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function CustomPainterClipperPage() {
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
            <span className="text-sm text-muted-foreground">30 min read</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl font-bold"
          >
            CustomPainter and CustomClipper
          </motion.h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/quiz/custom-painter-clipper-quiz">Take Quiz</Link>
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
                CustomPainter and CustomClipper are powerful classes in Flutter that allow you to create custom shapes,
                graphics, and clipping paths. They provide a low-level API for drawing directly on the canvas, enabling
                highly customized UI elements that aren't possible with standard widgets.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3>Introduction to CustomPainter</h3>
                <p>
                  CustomPainter is a class in Flutter that allows you to draw custom shapes and graphics on a canvas.
                  It's used with the CustomPaint widget to create complex visualizations, charts, or custom UI elements
                  that aren't possible with standard widgets.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`class CirclePainter extends CustomPainter {
  final Color color;
  
  CirclePainter({required this.color});
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;
      
    final center = Offset(size.width / 2, size.height / 2);
    final radius = min(size.width, size.height) / 2;
    
    canvas.drawCircle(center, radius, paint);
  }
  
  @override
  bool shouldRepaint(CirclePainter oldDelegate) {
    return oldDelegate.color != color;
  }
}`}</code>
                </pre>
                <p>To use this CustomPainter, you would wrap it in a CustomPaint widget:</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`CustomPaint(
  painter: CirclePainter(color: Colors.blue),
  size: Size(200, 200),
)`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h3>Drawing Shapes and Paths</h3>
                <p>
                  The Canvas API provides methods for drawing shapes like drawCircle(), drawRect(), and drawPath(). You
                  can also use Path objects to create complex shapes by combining lines, curves, and arcs.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`void paint(Canvas canvas, Size size) {
  final paint = Paint()
    ..color = Colors.blue
    ..style = PaintingStyle.stroke
    ..strokeWidth = 4.0;
    
  // Draw a rectangle
  canvas.drawRect(
    Rect.fromLTWH(20, 20, 100, 100),
    paint,
  );
  
  // Draw a circle
  canvas.drawCircle(
    Offset(200, 70),
    50,
    paint..color = Colors.red,
  );
  
  // Draw a custom path
  final path = Path()
    ..moveTo(300, 20)
    ..lineTo(350, 120)
    ..lineTo(250, 120)
    ..close();
    
  canvas.drawPath(
    path,
    paint..color = Colors.green,
  );
}`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h3>Introduction to CustomClipper</h3>
                <p>
                  CustomClipper is similar to CustomPainter but is used to clip widgets to custom shapes. It's used with
                  widgets like ClipPath to create non-rectangular UI elements.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`class WaveClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    final path = Path();
    path.lineTo(0, size.height * 0.8);
    
    final firstControlPoint = Offset(size.width * 0.25, size.height);
    final firstEndPoint = Offset(size.width * 0.5, size.height * 0.8);
    path.quadraticBezierTo(
      firstControlPoint.dx,
      firstControlPoint.dy,
      firstEndPoint.dx,
      firstEndPoint.dy,
    );
    
    final secondControlPoint = Offset(size.width * 0.75, size.height * 0.6);
    final secondEndPoint = Offset(size.width, size.height * 0.8);
    path.quadraticBezierTo(
      secondControlPoint.dx,
      secondControlPoint.dy,
      secondEndPoint.dx,
      secondEndPoint.dy,
    );
    
    path.lineTo(size.width, 0);
    path.close();
    return path;
  }
  
  @override
  bool shouldReclip(WaveClipper oldClipper) => false;
}`}</code>
                </pre>
                <p>To use this CustomClipper, you would wrap a widget in a ClipPath:</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`ClipPath(
  clipper: WaveClipper(),
  child: Container(
    color: Colors.blue,
    height: 200,
  ),
)`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <h3>Common Clipping Shapes</h3>
                <p>
                  Common clipping shapes include rounded rectangles, circles, ovals, and custom paths. You can also
                  create complex shapes by combining multiple paths.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// Circular clipper
class CircleClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    final path = Path();
    path.addOval(Rect.fromCircle(
      center: Offset(size.width / 2, size.height / 2),
      radius: min(size.width, size.height) / 2,
    ));
    return path;
  }
  
  @override
  bool shouldReclip(CircleClipper oldClipper) => false;
}

// Rounded rectangle clipper
class RoundedRectClipper extends CustomClipper<Path> {
  final double radius;
  
  RoundedRectClipper({this.radius = 20.0});
  
  @override
  Path getClip(Size size) {
    final path = Path();
    path.addRRect(RRect.fromRectAndRadius(
      Rect.fromLTWH(0, 0, size.width, size.height),
      Radius.circular(radius),
    ));
    return path;
  }
  
  @override
  bool shouldReclip(RoundedRectClipper oldClipper) => 
    oldClipper.radius != radius;
}`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <h3>Performance Considerations</h3>
                <p>
                  Custom painting and clipping can be expensive operations. To optimize performance, minimize the number
                  of path operations, use simpler shapes when possible, and implement shouldRepaint() and shouldReclip()
                  correctly to avoid unnecessary repaints and reclips.
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`// Efficient implementation of shouldRepaint
@override
bool shouldRepaint(MyPainter oldDelegate) {
  // Only repaint if the properties that affect the painting have changed
  return oldDelegate.color != color || 
         oldDelegate.strokeWidth != strokeWidth;
}

// Caching paths for better performance
class EfficientPathPainter extends CustomPainter {
  final Color color;
  Path? _cachedPath;
  
  EfficientPathPainter({required this.color});
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;
      
    // Create the path only once and cache it
    _cachedPath ??= _createPath(size);
    
    canvas.drawPath(_cachedPath!, paint);
  }
  
  Path _createPath(Size size) {
    // Complex path creation logic here
    final path = Path();
    // ...
    return path;
  }
  
  @override
  bool shouldRepaint(EfficientPathPainter oldDelegate) {
    return oldDelegate.color != color;
  }
}`}</code>
                </pre>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <h3>Practical Applications</h3>
                <p>CustomPainter and CustomClipper have many practical applications in Flutter development:</p>
                <ul>
                  <li>Custom charts and graphs</li>
                  <li>Signature pads</li>
                  <li>Custom progress indicators</li>
                  <li>Decorative UI elements</li>
                  <li>Custom shapes for containers and buttons</li>
                  <li>Complex animations</li>
                  <li>Drawing tools</li>
                </ul>
                <p>
                  These tools give you the flexibility to create unique and engaging user interfaces that stand out from
                  standard widget-based UIs.
                </p>
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
          <Link href="/topics/flutter-navigation">
            <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Flutter Navigation System</h3>
                  <DifficultyBadge level="middle" />
                </div>
                <p className="text-muted-foreground">Understanding navigation and routing in Flutter applications</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Link href="/topics/advanced-animations">
            <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Advanced Animations</h3>
                  <DifficultyBadge level="senior" />
                </div>
                <p className="text-muted-foreground">Creating complex and custom animations in Flutter</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Link href="/topics/flutter-widgets">
            <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Flutter Widgets</h3>
                  <DifficultyBadge level="junior" />
                </div>
                <p className="text-muted-foreground">Understanding the building blocks of Flutter UI</p>
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
