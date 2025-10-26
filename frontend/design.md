# 🎨 UI Design Prompt for Todo Application

## Copy this prompt to your AI UI design tool:

---

**Design a modern, minimalist Todo Application UI with the following specifications:**

## 📱 Overall Layout & Style

### Design System
- **Primary Colors**: Blue color palette (#2563EB, #3B82F6, #60A5FA)
- **Neutral Colors**: White (#FFFFFF) for backgrounds, Black (#000000) and grays (#1F2937, #6B7280, #F3F4F6) for text
- **Design Style**: Modern, clean, minimalist with subtle shadows and smooth animations
- **Typography**: Sans-serif font family (Inter, SF Pro, or Roboto)
- **Spacing**: Use 8px grid system for consistent spacing
- **Border Radius**: 12px for cards, 8px for buttons and inputs

### Responsive Design
- Desktop-first approach with mobile-responsive breakpoints
- Maximum content width: 800px centered on page
- Padding: 24px on desktop, 16px on mobile

---

## 🎯 Main Components

### 1. Header Section
**Requirements:**
- Application title "Task Manager" or "My Tasks" in large, bold typography
- Optional tagline or subtitle underneath
- Clean, spacious header with subtle gradient background (blue tones)
- White text for contrast
- Height: 120-150px

**Visual Style:**
- Gradient background from darker blue (#2563EB) to lighter blue (#3B82F6)
- Centered text with slight letter spacing
- Optional: Add a subtle icon or emoji (✓ or 📝) next to title

---

### 2. Task Input Form (Top Section)
**Requirements:**
- Clean, prominent input area for adding new tasks
- Two input fields:
  1. **Task Title** (single-line input, placeholder: "What needs to be done?")
  2. **Task Description** (multi-line textarea, placeholder: "Add details...")
- **Add Task** button with icon (+ symbol)
- All elements in a white card with subtle shadow

**Layout:**
- Vertical stack of inputs
- Full-width inputs with proper padding (16px)
- Button positioned at bottom-right of the form
- Inputs should have light border (1px solid #E5E7EB)
- On focus: Blue border (#3B82F6) with subtle glow effect

**Visual Style:**
- White background card elevated with shadow: `0 4px 6px rgba(0, 0, 0, 0.1)`
- Border radius: 12px
- Inner padding: 24px
- Button: Blue gradient background, white text, rounded corners
- Button hover effect: Slightly darker blue with lift animation

---

### 3. Task List Display (Bottom Section)
**Requirements:**
- Display **ONLY the 5 most recent tasks** in reverse chronological order (newest first)
- Each task shown as a card with:
  - Task title (bold, larger font)
  - Task description (smaller, gray text)
  - Timestamp or creation date (very small, light gray)
  - **"Done"** button (prominent, right side)
- Visual separator between cards
- Empty state message when no tasks exist: "No tasks yet. Create one above!"

**Card Design:**
- White background with border-left accent (4px thick blue bar)
- Padding: 20px
- Margin between cards: 16px
- Subtle shadow: `0 2px 4px rgba(0, 0, 0, 0.05)`
- Hover effect: Slight elevation and shadow increase

**Done Button:**
- Position: Right side of card, vertically centered
- Style: Blue background (#2563EB), white text, rounded (8px)
- Padding: 10px 20px
- Icon: Checkmark (✓) before text
- Hover: Darker blue with scale effect (1.05)
- On click: Smooth fade-out animation as task disappears

**Task Information Layout:**
- **Left section (flexible width):**
  - Title at top (font-weight: 600, color: #1F2937)
  - Description below (font-weight: 400, color: #6B7280, line-height: 1.6)
  - Timestamp at bottom (font-size: 12px, color: #9CA3AF)
- **Right section (fixed width):**
  - Done button aligned to right

---

## 🎨 Visual Hierarchy & UX Principles

### Typography Scale
- **Page Title**: 36px, Bold
- **Card Title**: 20px, Semibold
- **Card Description**: 16px, Regular
- **Button Text**: 15px, Medium
- **Timestamp**: 12px, Regular

### Color Usage Guidelines
- **Primary Action (Add/Done buttons)**: Blue (#2563EB)
- **Background**: Light gray (#F9FAFB) for page, White (#FFFFFF) for cards
- **Text Primary**: Near-black (#1F2937)
- **Text Secondary**: Medium gray (#6B7280)
- **Text Tertiary**: Light gray (#9CA3AF)
- **Borders**: Very light gray (#E5E7EB)
- **Accents**: Blue variants for highlights

### Micro-interactions
1. **Input Focus**: Border color changes to blue with subtle glow
2. **Button Hover**: Background darkens slightly, subtle lift effect
3. **Task Completion**: Smooth fade-out animation (300ms) when Done is clicked
4. **Card Hover**: Slight elevation increase with shadow enhancement
5. **Button Click**: Quick scale down then up (press effect)

---

## 📐 Spacing & Layout Specifications

### Page Layout
```
┌─────────────────────────────────────────┐
│           HEADER (Gradient)             │
│        "Task Manager" Title             │
└─────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────┐
│         TASK INPUT FORM (Card)          │
│  ┌───────────────────────────────────┐  │
│  │  Task Title Input                 │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Task Description Textarea        │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                    [+ Add Task Button]  │
└─────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────┐
│          TASK LIST (5 Recent)           │
│  ┌───────────────────────────────────┐  │
│ ││ Task 1 Title          [Done ✓]   │  │
│ ││ Description text...               │  │
│ ││ 2 hours ago                       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│ ││ Task 2 Title          [Done ✓]   │  │
│ ││ Description text...               │  │
│ ││ Yesterday                         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ... (up to 5 tasks total)             │
└─────────────────────────────────────────┘
```

### Spacing Values
- **Between header and form**: 40px
- **Between form and task list**: 32px
- **Between task cards**: 16px
- **Card internal padding**: 24px (form), 20px (task cards)
- **Button padding**: 12px 24px
- **Input padding**: 16px

---

## 🌟 Additional Design Enhancements

### Accessibility
- High contrast ratios (WCAG AA compliant)
- Focus indicators for keyboard navigation
- Clear hover states for interactive elements
- Proper semantic HTML structure

### Animations
- **Duration**: 200-300ms for most transitions
- **Easing**: ease-in-out or cubic-bezier(0.4, 0, 0.2, 1)
- **Task disappearance**: Fade out + slide up (400ms)
- **Card entrance**: Subtle fade-in when loaded

### Empty State
When no tasks exist:
- Centered message: "No tasks yet! 📝"
- Subtext: "Add your first task above to get started"
- Light gray text
- Optional illustration or icon

### Task Counter (Optional Enhancement)
- Small badge showing "5 Recent Tasks" or "Showing 5 of X tasks"
- Positioned above task list
- Light blue background (#EFF6FF)
- Blue text (#2563EB)

---

## 🎯 Key UI/UX Principles to Follow

1. **Visual Hierarchy**: Form at top (action-oriented), list below (content)
2. **Whitespace**: Generous spacing prevents cluttered appearance
3. **Consistency**: Same border radius, shadow depth, and spacing throughout
4. **Feedback**: Clear visual feedback for all interactions
5. **Simplicity**: Minimal UI with focus on task management
6. **Scannability**: Easy to quickly scan through tasks
7. **Progressive Disclosure**: Only show 5 most recent to avoid overwhelm
8. **Mobile-First Thinking**: Touch-friendly button sizes (minimum 44px height)
9. **Color Psychology**: Blue conveys trust, professionalism, and calm
10. **Affordance**: Buttons look clickable, inputs look editable

---

## 📱 Mobile Responsive Behavior

### Mobile Adjustments (< 768px)
- Reduce page padding to 16px
- Stack form inputs with full width
- Increase button size for easier tapping (minimum 48px height)
- Reduce card padding to 16px
- Adjust font sizes: Title to 28px, card titles to 18px
- Done button may move below task content for better touch targets

---

## 🎨 Color Palette Reference

### Primary Blues
- **Primary Dark**: #2563EB
- **Primary**: #3B82F6
- **Primary Light**: #60A5FA
- **Primary Lighter**: #93C5FD
- **Primary Lightest**: #DBEAFE
- **Background Tint**: #EFF6FF

### Neutrals
- **Black**: #000000 (rarely used, mostly for text)
- **Gray 900**: #1F2937 (primary text)
- **Gray 600**: #6B7280 (secondary text)
- **Gray 400**: #9CA3AF (tertiary text)
- **Gray 300**: #D1D5DB (borders)
- **Gray 200**: #E5E7EB (subtle borders)
- **Gray 100**: #F3F4F6 (subtle backgrounds)
- **Gray 50**: #F9FAFB (page background)
- **White**: #FFFFFF (card backgrounds)

### Semantic Colors
- **Success/Done**: #10B981 (green, optional for completed state)
- **Shadow**: rgba(0, 0, 0, 0.1) for elevation

---

## 🚀 Final Design Requirements

Create a high-fidelity mockup with:
- ✅ Clean, modern aesthetic
- ✅ Blue color scheme with white and black/gray accents
- ✅ Card-based task display (maximum 5 visible)
- ✅ Prominent Done button on each task
- ✅ Professional, business-appropriate design
- ✅ Smooth, subtle animations indicated
- ✅ Responsive layout considerations
- ✅ Proper spacing and typography
- ✅ High visual polish and attention to detail

**Output Format:** Full-page web design mockup suitable for implementation in React with CSS/Tailwind.

---

## 📝 Usage Instructions

Copy the entire prompt above into your AI UI design tool (v0.dev, Galileo AI, Uizard, etc.) for best results. The detailed specifications ensure consistency and professional quality.