/**
 * Utility functions for performance optimization
 */

// Debounce function to limit how often a function can be called
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function to limit the rate at which a function can fire
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Lazy load images that are not in the viewport
export function lazyLoadImages() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return

  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement
        image.src = image.dataset.src || ""
        image.removeAttribute("data-src")
        imageObserver.unobserve(image)
      }
    })
  })

  images.forEach((image) => imageObserver.observe(image))
}

// Preload critical resources
export function preloadCriticalResources(resources: string[]) {
  if (typeof window === "undefined") return

  resources.forEach((resource) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = resource
    link.as = resource.endsWith(".js")
      ? "script"
      : resource.endsWith(".css")
        ? "style"
        : resource.endsWith(".woff2") || resource.endsWith(".woff")
          ? "font"
          : "fetch"

    if (link.as === "font") {
      link.setAttribute("crossorigin", "anonymous")
    }

    document.head.appendChild(link)
  })
}
