"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Copy,
  Wand2,
  Globe,
  Code,
  Zap,
  Sparkles,
  Loader2,
  History,
  Save,
  Trash2,
  Smartphone,
  Monitor,
  ChevronDown,
  Search,
  Eye,
  Download,
  FileText,
  FileImage,
  CheckCircle,
  Edit3,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

interface FormData {
  projectType: string
  projectName: string
  description: string
  targetAudience: string
  colorScheme: ColorScheme
  framework: string
  features: string[]
  pages: string[]
  designStyle: string
  database: string
  authentication: string
  hosting: string
  performance: string[]
  security: string[]
  integrations: string[]
  additionalRequirements: string
}

interface PromptHistory {
  id: string
  name: string
  prompt: string
  formData: FormData
  createdAt: string
}

// Realistic project types that AI can generate
const projectTypes = [
  {
    value: "landing",
    label: "Landing Page",
    icon: "🚀",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg",
    category: "Web",
    description: "Single page marketing sites",
    aiCapable: true,
  },
  {
    value: "website",
    label: "Multi-page Website",
    icon: "🌐",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    category: "Web",
    description: "Complete websites with multiple pages",
    aiCapable: true,
  },
  {
    value: "dashboard",
    label: "Admin Dashboard",
    icon: "📊",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg",
    category: "Web",
    description: "Data visualization and management",
    aiCapable: true,
  },
  {
    value: "ecommerce",
    label: "E-commerce Store",
    icon: "🛒",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg",
    category: "Web",
    description: "Online shopping platforms",
    aiCapable: true,
  },
  {
    value: "portfolio",
    label: "Portfolio Website",
    icon: "💼",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/behance/behance-original.svg",
    category: "Web",
    description: "Personal or professional portfolios",
    aiCapable: true,
  },
  {
    value: "blog",
    label: "Blog/CMS",
    icon: "📝",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg",
    category: "Web",
    description: "Content management and blogging",
    aiCapable: true,
  },
  {
    value: "saas",
    label: "SaaS Application",
    icon: "☁️",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "Web",
    description: "Software as a Service platforms",
    aiCapable: true,
  },
  {
    value: "mobile-ui",
    label: "Mobile App UI",
    icon: "📱",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    category: "Mobile",
    description: "Mobile app user interfaces",
    aiCapable: true,
  },
  {
    value: "component-library",
    label: "UI Component Library",
    icon: "🧩",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg",
    category: "Design",
    description: "Reusable UI components",
    aiCapable: true,
  },
  {
    value: "email-template",
    label: "Email Template",
    icon: "📧",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    category: "Design",
    description: "HTML email templates",
    aiCapable: true,
  },
]

// AI-capable frameworks
const frameworks = [
  {
    value: "nextjs",
    label: "Next.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    popular: true,
    category: "Web",
    description: "React framework for production",
    aiCapable: true,
  },
  {
    value: "react",
    label: "React.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    popular: true,
    category: "Web",
    description: "JavaScript library for UIs",
    aiCapable: true,
  },
  {
    value: "vue",
    label: "Vue.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    popular: true,
    category: "Web",
    description: "Progressive JavaScript framework",
    aiCapable: true,
  },
  {
    value: "svelte",
    label: "Svelte",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
    category: "Web",
    description: "Cybernetically enhanced web apps",
    aiCapable: true,
  },
  {
    value: "html",
    label: "HTML/CSS/JS",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    category: "Web",
    description: "Vanilla web technologies",
    aiCapable: true,
  },
  {
    value: "tailwind",
    label: "Tailwind CSS",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    popular: true,
    category: "Web",
    description: "Utility-first CSS framework",
    aiCapable: true,
  },
  {
    value: "bootstrap",
    label: "Bootstrap",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    category: "Web",
    description: "CSS framework for responsive design",
    aiCapable: true,
  },
  {
    value: "react-native",
    label: "React Native",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    category: "Mobile",
    description: "Build mobile apps with React",
    aiCapable: true,
  },
]

// Realistic design styles
const designStyles = [
  { value: "modern", label: "Modern & Clean", icon: "✨", popular: true, description: "Sleek, contemporary design" },
  { value: "minimalist", label: "Minimalist", icon: "⚪", popular: true, description: "Less is more approach" },
  { value: "material", label: "Material Design", icon: "🎨", popular: true, description: "Google's design language" },
  { value: "dark", label: "Dark Theme", icon: "🌙", popular: true, description: "Dark mode interfaces" },
  { value: "corporate", label: "Corporate", icon: "🏢", description: "Professional business look" },
  { value: "creative", label: "Creative & Artistic", icon: "🎭", description: "Bold, creative styling" },
  { value: "glassmorphism", label: "Glassmorphism", icon: "🔮", description: "Frosted glass effect" },
  { value: "neumorphism", label: "Neumorphism", icon: "🎯", description: "Soft, extruded plastic look" },
]

// Realistic features that AI can implement
const featureCategories = {
  "Core Features": [
    "Responsive Design",
    "Navigation Menu",
    "Contact Form",
    "Search Functionality",
    "Image Gallery",
    "Video Integration",
    "Social Media Links",
    "Newsletter Signup",
  ],
  "User Features": [
    "User Registration",
    "Login/Logout",
    "User Profile",
    "Password Reset",
    "User Dashboard",
    "Account Settings",
  ],
  "Content Features": [
    "Blog Section",
    "Comments System",
    "Content Management",
    "Rich Text Editor",
    "File Upload",
    "Media Library",
    "Categories & Tags",
    "Search & Filter",
  ],
  "E-commerce Features": [
    "Product Catalog",
    "Shopping Cart",
    "Checkout Process",
    "Payment Integration",
    "Order Management",
    "Product Reviews",
    "Wishlist",
    "Inventory Display",
  ],
  "Advanced Features": [
    "Dark/Light Mode Toggle",
    "Multi-language Support",
    "SEO Optimization",
    "Analytics Integration",
    "Performance Optimization",
    "Accessibility Features",
    "Progressive Web App",
    "Offline Support",
  ],
}

// Predefined color schemes
const colorPresets = [
  {
    name: "Blue Ocean",
    colors: { primary: "#3B82F6", secondary: "#1E40AF", accent: "#06B6D4", background: "#F8FAFC", text: "#1E293B" },
  },
  {
    name: "Purple Magic",
    colors: { primary: "#8B5CF6", secondary: "#7C3AED", accent: "#EC4899", background: "#FAFAFA", text: "#374151" },
  },
  {
    name: "Green Nature",
    colors: { primary: "#10B981", secondary: "#059669", accent: "#34D399", background: "#F9FAFB", text: "#111827" },
  },
  {
    name: "Orange Sunset",
    colors: { primary: "#F59E0B", secondary: "#D97706", accent: "#FB923C", background: "#FFFBEB", text: "#92400E" },
  },
  {
    name: "Dark Mode",
    colors: { primary: "#6366F1", secondary: "#4F46E5", accent: "#8B5CF6", background: "#111827", text: "#F9FAFB" },
  },
]

// Custom hook for debounced value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Custom hook for prompt history
function usePromptHistory() {
  const [history, setHistory] = useState<PromptHistory[]>([])

  useEffect(() => {
    const savedHistory = localStorage.getItem("prompt-history")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveToHistory = useCallback(
    (name: string, prompt: string, formData: FormData) => {
      const newEntry: PromptHistory = {
        id: Date.now().toString(),
        name,
        prompt,
        formData,
        createdAt: new Date().toISOString(),
      }

      const updatedHistory = [newEntry, ...history].slice(0, 20)
      setHistory(updatedHistory)
      localStorage.setItem("prompt-history", JSON.stringify(updatedHistory))
    },
    [history],
  )

  const deleteFromHistory = useCallback(
    (id: string) => {
      const updatedHistory = history.filter((item) => item.id !== id)
      setHistory(updatedHistory)
      localStorage.setItem("prompt-history", JSON.stringify(updatedHistory))
    },
    [history],
  )

  const loadFromHistory = useCallback(
    (id: string) => {
      return history.find((item) => item.id === id)
    },
    [history],
  )

  return { history, saveToHistory, deleteFromHistory, loadFromHistory }
}

// Selection Modal Component
interface SelectionModalProps {
  title: string
  description: string
  items: any[]
  selectedValue: string
  onSelect: (value: string) => void
  children: React.ReactNode
  searchable?: boolean
}

function SelectionModal({
  title,
  description,
  items,
  selectedValue,
  onSelect,
  children,
  searchable = true,
}: SelectionModalProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter only AI-capable items
  const aiCapableItems = items.filter((item) => item.aiCapable !== false)

  const filteredItems = useMemo(() => {
    if (!searchTerm) return aiCapableItems
    return aiCapableItems.filter(
      (item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [aiCapableItems, searchTerm])

  const groupedItems = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        const category = item.category || "Other"
        if (!acc[category]) acc[category] = []
        acc[category].push(item)
        return acc
      },
      {} as Record<string, typeof items>,
    )
  }, [filteredItems])

  const handleSelect = (value: string) => {
    onSelect(value)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {searchable && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        <div className="overflow-y-auto max-h-[60vh] pr-2">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryItems.map((item) => (
                  <Button
                    key={item.value}
                    variant={selectedValue === item.value ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-start gap-3 text-left ${
                      selectedValue === item.value ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => handleSelect(item.value)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {item.logo ? (
                        <img
                          src={item.logo || "/placeholder.svg"}
                          alt={item.label}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                            target.nextElementSibling!.textContent = item.icon || "⚙️"
                          }}
                        />
                      ) : null}
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.label}</div>
                        {item.popular && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                    {item.description && <p className="text-xs text-gray-500 text-left w-full">{item.description}</p>}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Preview Mode Component
function PreviewMode({ formData, onUpdate }: { formData: FormData; onUpdate: (data: FormData) => void }) {
  const [editableData, setEditableData] = useState(formData)

  useEffect(() => {
    setEditableData(formData)
  }, [formData])

  const handleUpdate = (field: string, value: any) => {
    const newData = { ...editableData, [field]: value }
    setEditableData(newData)
    onUpdate(newData)
  }

  const selectedProjectType = projectTypes.find((t) => t.value === editableData.projectType)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Preview Mode</h3>
        <p className="text-gray-600">See how your project will look and make quick edits</p>
      </div>

      {/* Project Overview */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            {selectedProjectType?.logo && (
              <img src={selectedProjectType.logo || "/placeholder.svg"} alt="" className="w-12 h-12 object-contain" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Input
                  value={editableData.projectName || "Untitled Project"}
                  onChange={(e) => handleUpdate("projectName", e.target.value)}
                  className="text-xl font-bold border-none p-0 h-auto bg-transparent"
                  placeholder="Project Name"
                />
                <Edit3 className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-gray-600">{selectedProjectType?.label}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={editableData.description}
                onChange={(e) => handleUpdate("description", e.target.value)}
                placeholder="Describe your project..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Target Audience</Label>
              <Input
                value={editableData.targetAudience}
                onChange={(e) => handleUpdate("targetAudience", e.target.value)}
                placeholder="Who is this for?"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Color Scheme Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-lg border-2" style={{ backgroundColor: editableData.colorScheme.background }}>
            <div className="space-y-4">
              <h4 style={{ color: editableData.colorScheme.text }} className="text-xl font-bold">
                Sample Heading
              </h4>
              <p style={{ color: editableData.colorScheme.text }} className="text-sm">
                This is how your text will look with the selected color scheme.
              </p>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: editableData.colorScheme.primary,
                    color: editableData.colorScheme.background,
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: editableData.colorScheme.secondary,
                    color: editableData.colorScheme.background,
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: editableData.colorScheme.accent,
                    color: editableData.colorScheme.background,
                  }}
                >
                  Accent
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Preview */}
      {editableData.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Features ({editableData.features.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {editableData.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mockup Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Mockup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="space-y-4">
              {/* Header */}
              <div
                className="h-16 rounded flex items-center px-4"
                style={{ backgroundColor: editableData.colorScheme.primary }}
              >
                <div className="w-8 h-8 bg-white/20 rounded"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-white/30 rounded w-32"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-white/20 rounded"></div>
                  <div className="h-8 w-16 bg-white/20 rounded"></div>
                </div>
              </div>

              {/* Content Area */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="h-12 rounded flex items-center justify-center"
                style={{ backgroundColor: editableData.colorScheme.secondary }}
              >
                <div className="h-4 bg-white/30 rounded w-24"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Export functionality
const exportToTxt = (prompt: string, projectName: string) => {
  const blob = new Blob([prompt], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${projectName || "prompt"}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const exportToJson = (formData: FormData, prompt: string, projectName: string) => {
  const data = {
    projectInfo: {
      name: formData.projectName,
      type: formData.projectType,
      description: formData.description,
      targetAudience: formData.targetAudience,
    },
    technical: {
      framework: formData.framework,
      designStyle: formData.designStyle,
      colorScheme: formData.colorScheme,
    },
    features: formData.features,
    prompt: prompt,
    generatedAt: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${projectName || "prompt"}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const exportToMarkdown = (formData: FormData, prompt: string, projectName: string) => {
  const markdown = `# ${formData.projectName || "AI Project Prompt"}

## Project Overview
- **Type**: ${projectTypes.find((t) => t.value === formData.projectType)?.label || "Not specified"}
- **Target Audience**: ${formData.targetAudience || "Not specified"}
- **Framework**: ${frameworks.find((f) => f.value === formData.framework)?.label || "Not specified"}

## Description
${formData.description || "No description provided"}

## Color Scheme
- **Primary**: ${formData.colorScheme.primary}
- **Secondary**: ${formData.colorScheme.secondary}
- **Accent**: ${formData.colorScheme.accent}
- **Background**: ${formData.colorScheme.background}
- **Text**: ${formData.colorScheme.text}

## Features
${formData.features.map((feature) => `- ${feature}`).join("\n")}

## AI Prompt
\`\`\`
${prompt}
\`\`\`

---
*Generated on ${new Date().toLocaleDateString()}*
`

  const blob = new Blob([markdown], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${projectName || "prompt"}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export default function PromptGenerator() {
  const { toast } = useToast()
  const { history, saveToHistory, deleteFromHistory, loadFromHistory } = usePromptHistory()
  const [isGenerating, setIsGenerating] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [saveName, setSaveName] = useState("")

  const [formData, setFormData] = useState<FormData>({
    projectType: "",
    projectName: "",
    description: "",
    targetAudience: "",
    colorScheme: {
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#06B6D4",
      background: "#F8FAFC",
      text: "#1E293B",
    },
    framework: "nextjs",
    features: [],
    pages: [],
    designStyle: "modern",
    database: "",
    authentication: "",
    hosting: "",
    performance: [],
    security: [],
    integrations: [],
    additionalRequirements: "",
  })

  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const debouncedFormData = useDebounce(formData, 500)

  const handleFeatureChange = useCallback((feature: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: checked ? [...prev.features, feature] : prev.features.filter((f) => f !== feature),
    }))
  }, [])

  const handleColorPresetSelect = useCallback((preset: (typeof colorPresets)[0]) => {
    setFormData((prev) => ({
      ...prev,
      colorScheme: preset.colors,
    }))
  }, [])

  const generatePrompt = useCallback(() => {
    setIsGenerating(true)

    setTimeout(() => {
      let prompt = ""

      const projectTypeLabel =
        projectTypes.find((t) => t.value === debouncedFormData.projectType)?.label || "web application"

      if (debouncedFormData.projectName) {
        prompt += `Create a ${projectTypeLabel.toLowerCase()} called "${debouncedFormData.projectName}"`
      } else {
        prompt += `Create a ${projectTypeLabel.toLowerCase()}`
      }

      if (debouncedFormData.description) {
        prompt += `. ${debouncedFormData.description}`
      }

      if (debouncedFormData.targetAudience) {
        prompt += ` The target audience is ${debouncedFormData.targetAudience}.`
      }

      prompt += `\n\nTechnical Requirements:\n`
      prompt += `- Framework: ${frameworks.find((f) => f.value === debouncedFormData.framework)?.label || "Next.js"}\n`
      prompt += `- Design Style: ${designStyles.find((d) => d.value === debouncedFormData.designStyle)?.label || "Modern & Clean"}\n`

      prompt += `\nColor Scheme:\n`
      prompt += `- Primary Color: ${debouncedFormData.colorScheme.primary}\n`
      prompt += `- Secondary Color: ${debouncedFormData.colorScheme.secondary}\n`
      prompt += `- Accent Color: ${debouncedFormData.colorScheme.accent}\n`
      prompt += `- Background: ${debouncedFormData.colorScheme.background}\n`
      prompt += `- Text Color: ${debouncedFormData.colorScheme.text}\n`

      if (debouncedFormData.features.length > 0) {
        prompt += `\nFeatures to implement:\n`
        debouncedFormData.features.forEach((feature) => {
          prompt += `- ${feature}\n`
        })
      }

      if (debouncedFormData.additionalRequirements) {
        prompt += `\nAdditional Requirements:\n${debouncedFormData.additionalRequirements}\n`
      }

      prompt += `\nPlease ensure:\n`
      prompt += `- Modern and responsive design for all screen sizes\n`
      prompt += `- Clean, semantic HTML structure\n`
      prompt += `- Accessible and user-friendly interface\n`
      prompt += `- Optimized performance and fast loading\n`
      prompt += `- Cross-browser compatibility\n`
      prompt += `- SEO-friendly structure\n`
      prompt += `- Well-organized and maintainable code\n`

      setGeneratedPrompt(prompt)
      setIsGenerating(false)
    }, 300)
  }, [debouncedFormData])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      toast({
        title: "✅ Berhasil disalin!",
        description: "Prompt telah disalin ke clipboard dan siap digunakan di AI.",
        duration: 3000,
      })
    } catch (err) {
      toast({
        title: "❌ Gagal menyalin",
        description: "Terjadi kesalahan saat menyalin prompt.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleExport = (format: string) => {
    const projectName = formData.projectName || "ai-prompt"

    switch (format) {
      case "txt":
        exportToTxt(generatedPrompt, projectName)
        break
      case "json":
        exportToJson(formData, generatedPrompt, projectName)
        break
      case "md":
        exportToMarkdown(formData, generatedPrompt, projectName)
        break
    }

    toast({
      title: "✅ File berhasil diunduh!",
      description: `Prompt telah diekspor ke format ${format.toUpperCase()}.`,
      duration: 3000,
    })
  }

  const handleSavePrompt = () => {
    if (!saveName.trim()) {
      toast({
        title: "❌ Nama tidak boleh kosong",
        description: "Masukkan nama untuk menyimpan prompt.",
        variant: "destructive",
      })
      return
    }

    saveToHistory(saveName, generatedPrompt, formData)
    setSaveName("")
    setSaveDialogOpen(false)
    toast({
      title: "✅ Prompt tersimpan!",
      description: "Prompt telah disimpan ke riwayat.",
    })
  }

  const handleLoadFromHistory = (id: string) => {
    const historyItem = loadFromHistory(id)
    if (historyItem) {
      setFormData(historyItem.formData)
      setGeneratedPrompt(historyItem.prompt)
      setHistoryDialogOpen(false)
      toast({
        title: "✅ Prompt dimuat!",
        description: "Data telah dimuat dari riwayat.",
      })
    }
  }

  const FeatureCheckboxes = useMemo(() => {
    return Object.entries(featureCategories).map(([category, features]) => (
      <div key={category} className="space-y-3">
        <h4 className="font-semibold text-sm text-gray-800 border-b border-gray-200 pb-2">{category}</h4>
        <div className="grid grid-cols-1 gap-2">
          {features.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={`feature-${feature}`}
                checked={formData.features.includes(feature)}
                onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
              />
              <Label htmlFor={`feature-${feature}`} className="text-sm leading-relaxed">
                {feature}
              </Label>
            </div>
          ))}
        </div>
      </div>
    ))
  }, [formData.features, handleFeatureChange])

  useEffect(() => {
    generatePrompt()
  }, [generatePrompt])

  // Get selected item labels for display
  const selectedProjectType = projectTypes.find((t) => t.value === formData.projectType)
  const selectedFramework = frameworks.find((f) => f.value === formData.framework)
  const selectedDesignStyle = designStyles.find((d) => d.value === formData.designStyle)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8 lg:mb-12 px-2">
          <div className="flex items-center justify-center gap-2 lg:gap-3 mb-4 lg:mb-6">
            <div className="relative">
              <div className="h-8 w-8 lg:h-12 lg:w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                <Sparkles className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 lg:h-4 lg:w-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              AI Prompt Generator
            </h1>
          </div>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            Buat prompt yang sempurna untuk AI dalam membuat{" "}
            <span className="font-semibold text-blue-600">website, aplikasi, dan UI components</span> yang realistis.
            <br className="hidden sm:block" />
            <span className="text-indigo-600 font-medium">
              Pilih spesifikasi yang dapat diimplementasikan oleh AI dan dapatkan prompt yang siap digunakan.
            </span>
          </p>
          <div className="flex items-center justify-center gap-2 lg:gap-3 mt-4 lg:mt-6 flex-wrap px-4">
            <Badge variant="secondary" className="px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm">
              🤖 AI-Optimized
            </Badge>
            <Badge variant="secondary" className="px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm">
              ⚡ Realistic Features
            </Badge>
            <Badge variant="secondary" className="px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm">
              📱 Responsive Design
            </Badge>
            <Badge variant="secondary" className="px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm">
              🎨 Modern UI
            </Badge>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6 lg:mb-8 px-4">
          <Tabs value={previewMode ? "preview" : "form"} onValueChange={(value) => setPreviewMode(value === "preview")}>
            <TabsList className="grid w-full grid-cols-2 max-w-sm lg:max-w-md">
              <TabsTrigger value="form" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                <Code className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Form Mode</span>
                <span className="sm:hidden">Form</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Preview Mode</span>
                <span className="sm:hidden">Preview</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form/Preview Section */}
          <div className="lg:col-span-2">
            {previewMode ? (
              <PreviewMode formData={formData} onUpdate={setFormData} />
            ) : (
              <div className="space-y-6">
                {/* Basic Information */}
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Project Information
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Define your project type and basic details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <Label className="text-base font-semibold">Project Type</Label>
                      <SelectionModal
                        title="Select Project Type"
                        description="Choose a project type that AI can realistically create"
                        items={projectTypes}
                        selectedValue={formData.projectType}
                        onSelect={(value) => setFormData((prev) => ({ ...prev, projectType: value }))}
                      >
                        <Button variant="outline" className="w-full h-16 mt-2 justify-between text-left bg-transparent">
                          <div className="flex items-center gap-3">
                            {selectedProjectType ? (
                              <>
                                {selectedProjectType.logo ? (
                                  <img
                                    src={selectedProjectType.logo || "/placeholder.svg"}
                                    alt={selectedProjectType.label}
                                    className="w-8 h-8 object-contain"
                                  />
                                ) : (
                                  <span className="text-2xl">{selectedProjectType.icon}</span>
                                )}
                                <div>
                                  <div className="font-medium">{selectedProjectType.label}</div>
                                  <div className="text-sm text-gray-500">{selectedProjectType.description}</div>
                                </div>
                              </>
                            ) : (
                              <span className="text-gray-500">Select project type...</span>
                            )}
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </SelectionModal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="projectName" className="text-base font-semibold">
                          Project Name
                        </Label>
                        <Input
                          id="projectName"
                          placeholder="e.g., TaskMaster Pro"
                          value={formData.projectName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, projectName: e.target.value }))}
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="targetAudience" className="text-base font-semibold">
                          Target Audience
                        </Label>
                        <Input
                          id="targetAudience"
                          placeholder="e.g., Small business owners"
                          value={formData.targetAudience}
                          onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                          className="mt-2 h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-base font-semibold">
                        Project Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your project goals, features, and requirements..."
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Technical & Design */}
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Technical & Design Specifications
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Choose AI-compatible frameworks and design styles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-semibold">Framework/Platform</Label>
                        <SelectionModal
                          title="Select Framework"
                          description="Choose a framework that AI can work with effectively"
                          items={frameworks}
                          selectedValue={formData.framework}
                          onSelect={(value) => setFormData((prev) => ({ ...prev, framework: value }))}
                        >
                          <Button
                            variant="outline"
                            className="w-full h-16 mt-2 justify-between text-left bg-transparent"
                          >
                            <div className="flex items-center gap-3">
                              {selectedFramework ? (
                                <>
                                  <img
                                    src={selectedFramework.logo || "/placeholder.svg"}
                                    alt={selectedFramework.label}
                                    className="w-8 h-8 object-contain"
                                  />
                                  <div>
                                    <div className="font-medium">{selectedFramework.label}</div>
                                    <div className="text-sm text-gray-500">{selectedFramework.description}</div>
                                  </div>
                                </>
                              ) : (
                                <span className="text-gray-500">Select framework...</span>
                              )}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </SelectionModal>
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Design Style</Label>
                        <SelectionModal
                          title="Select Design Style"
                          description="Choose a design style that AI can implement"
                          items={designStyles}
                          selectedValue={formData.designStyle}
                          onSelect={(value) => setFormData((prev) => ({ ...prev, designStyle: value }))}
                        >
                          <Button
                            variant="outline"
                            className="w-full h-16 mt-2 justify-between text-left bg-transparent"
                          >
                            <div className="flex items-center gap-3">
                              {selectedDesignStyle ? (
                                <>
                                  <span className="text-2xl">{selectedDesignStyle.icon}</span>
                                  <div>
                                    <div className="font-medium">{selectedDesignStyle.label}</div>
                                    <div className="text-sm text-gray-500">{selectedDesignStyle.description}</div>
                                  </div>
                                </>
                              ) : (
                                <span className="text-gray-500">Select design style...</span>
                              )}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </SelectionModal>
                      </div>
                    </div>

                    {/* Color Scheme Section */}
                    <div>
                      <Label className="text-base font-semibold">Color Scheme</Label>

                      {/* Color Presets */}
                      <div className="mt-3">
                        <Label className="text-sm text-gray-600">Quick Presets</Label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                          {colorPresets.map((preset) => (
                            <Button
                              key={preset.name}
                              variant="outline"
                              size="sm"
                              onClick={() => handleColorPresetSelect(preset)}
                              className="h-12 flex flex-col items-center gap-1 p-2"
                            >
                              <div className="flex gap-1">
                                <div
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: preset.colors.primary }}
                                />
                                <div
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: preset.colors.secondary }}
                                />
                                <div
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: preset.colors.accent }}
                                />
                              </div>
                              <span className="text-xs">{preset.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Color Pickers */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                        <div>
                          <Label className="text-sm font-medium">Primary</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={formData.colorScheme.primary}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colorScheme: { ...prev.colorScheme, primary: e.target.value },
                                }))
                              }
                              className="w-12 h-10 rounded border cursor-pointer"
                            />
                            <Input
                              value={formData.colorScheme.primary}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colorScheme: { ...prev.colorScheme, primary: e.target.value },
                                }))
                              }
                              className="text-xs h-10"
                              placeholder="#3B82F6"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Secondary</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={formData.colorScheme.secondary}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colorScheme: { ...prev.colorScheme, secondary: e.target.value },
                                }))
                              }
                              className="w-12 h-10 rounded border cursor-pointer"
                            />
                            <Input
                              value={formData.colorScheme.secondary}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colorScheme: { ...prev.colorScheme, secondary: e.target.value },
                                }))
                              }
                              className="text-xs h-10"
                              placeholder="#1E40AF"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Accent</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={formData.colorScheme.accent}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colorScheme: { ...prev.colorScheme, accent: e.target.value },
                                }))
                              }
                              className="w-12 h-10 rounded border cursor-pointer"
                            />
                            <Input
                              value={formData.colorScheme.accent}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colorScheme: { ...prev.colorScheme, accent: e.target.value },
                                }))
                              }
                              className="text-xs h-10"
                              placeholder="#06B6D4"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Background</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={formData.colorScheme.background}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colorScheme: { ...prev.colorScheme, background: e.target.value },
                                }))
                              }
                              className="w-12 h-10 rounded border cursor-pointer"
                            />
                            <Input
                              value={formData.colorScheme.background}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colorScheme: { ...prev.colorScheme, background: e.target.value },
                                }))
                              }
                              className="text-xs h-10"
                              placeholder="#F8FAFC"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Text</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={formData.colorScheme.text}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colorScheme: { ...prev.colorScheme, text: e.target.value },
                                }))
                              }
                              className="w-12 h-10 rounded border cursor-pointer"
                            />
                            <Input
                              value={formData.colorScheme.text}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colorScheme: { ...prev.colorScheme, text: e.target.value },
                                }))
                              }
                              className="text-xs h-10"
                              placeholder="#1E293B"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Color Preview */}
                      <div
                        className="mt-4 p-4 rounded-lg border"
                        style={{ backgroundColor: formData.colorScheme.background }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="px-4 py-2 rounded-lg font-medium"
                            style={{
                              backgroundColor: formData.colorScheme.primary,
                              color: formData.colorScheme.background,
                            }}
                          >
                            Primary Button
                          </div>
                          <div
                            className="px-4 py-2 rounded-lg font-medium"
                            style={{
                              backgroundColor: formData.colorScheme.secondary,
                              color: formData.colorScheme.background,
                            }}
                          >
                            Secondary
                          </div>
                          <div
                            className="px-4 py-2 rounded-lg font-medium"
                            style={{
                              backgroundColor: formData.colorScheme.accent,
                              color: formData.colorScheme.background,
                            }}
                          >
                            Accent
                          </div>
                          <span style={{ color: formData.colorScheme.text }}>Sample text color</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Features & Functionality
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Select realistic features that AI can implement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6 max-h-96 overflow-y-auto pr-2">{FeatureCheckboxes}</div>
                  </CardContent>
                </Card>

                {/* Additional Requirements */}
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Additional Requirements</CardTitle>
                    <CardDescription>Add any specific requirements or constraints</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="e.g., Must be mobile-first, include specific animations, follow brand guidelines..."
                      value={formData.additionalRequirements}
                      onChange={(e) => setFormData((prev) => ({ ...prev, additionalRequirements: e.target.value }))}
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Generated Prompt Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Prompt Output */}
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      Generated Prompt
                    </span>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {generatedPrompt.length} chars
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-orange-100">Ready for AI platforms</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="relative">
                    {isGenerating ? (
                      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-amber-500" />
                          <p className="text-sm text-gray-300">Generating prompt...</p>
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        value={generatedPrompt}
                        readOnly
                        className="min-h-[400px] font-mono text-sm resize-none bg-gray-800 border-gray-700 text-gray-100"
                        placeholder="Your generated prompt will appear here..."
                      />
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={copyToClipboard}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      disabled={!generatedPrompt || isGenerating}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          disabled={!generatedPrompt || isGenerating}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleExport("txt")}>
                          <FileText className="h-4 w-4 mr-2" />
                          Export as TXT
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport("md")}>
                          <FileImage className="h-4 w-4 mr-2" />
                          Export as Markdown
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport("json")}>
                          <Code className="h-4 w-4 mr-2" />
                          Export as JSON
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          disabled={!generatedPrompt || isGenerating}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save Prompt</DialogTitle>
                          <DialogDescription>Give your prompt a name to save it to history</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="e.g., My Awesome App Prompt"
                            value={saveName}
                            onChange={(e) => setSaveName(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleSavePrompt} className="flex-1">
                              Save
                            </Button>
                            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Prompt History</DialogTitle>
                          <DialogDescription>Load or delete previously saved prompts</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          {history.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No saved prompts yet</p>
                          ) : (
                            history.map((item) => (
                              <div key={item.id} className="border rounded-lg p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleLoadFromHistory(item.id)}>
                                      Load
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => deleteFromHistory(item.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-500 line-clamp-2">{item.prompt.substring(0, 100)}...</p>
                              </div>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Feature Summary */}
                  {formData.features.length > 0 && (
                    <div className="space-y-2 text-xs">
                      <Label className="text-amber-400 font-medium">
                        Selected Features ({formData.features.length}):
                      </Label>
                      <div className="flex flex-wrap gap-1">
                        {formData.features.slice(0, 6).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {feature.length > 15 ? feature.substring(0, 15) + "..." : feature}
                          </Badge>
                        ))}
                        {formData.features.length > 6 && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            +{formData.features.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Platform Suggestions */}
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">🤖 Recommended AI Platforms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Code className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">v0 by Vercel</p>
                        <p className="text-xs text-gray-600">Best for web apps & UI</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">ChatGPT</p>
                        <p className="text-xs text-gray-600">Great for all project types</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Monitor className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Claude</p>
                        <p className="text-xs text-gray-600">Excellent for complex apps</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-12 lg:mt-16 text-center px-4">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white">
            <h3 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">🚀 Pro Tips for Better AI Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-sm">
              <div className="bg-white/10 rounded-lg p-3 lg:p-4">
                <div className="text-xl lg:text-2xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base">Be Realistic</h4>
                <p className="text-xs lg:text-sm leading-relaxed">
                  Choose features and technologies that AI can actually implement
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 lg:p-4">
                <div className="text-xl lg:text-2xl mb-2">🎨</div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base">Use Preview Mode</h4>
                <p className="text-xs lg:text-sm leading-relaxed">
                  Visualize your project and make adjustments before generating
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 lg:p-4">
                <div className="text-xl lg:text-2xl mb-2">💾</div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base">Save & Export</h4>
                <p className="text-xs lg:text-sm leading-relaxed">
                  Save your prompts and export in multiple formats for easy sharing
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 lg:p-4">
                <div className="text-xl lg:text-2xl mb-2">🔄</div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base">Iterate & Improve</h4>
                <p className="text-xs lg:text-sm leading-relaxed">
                  Use the copy notification to track your progress and refine prompts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
