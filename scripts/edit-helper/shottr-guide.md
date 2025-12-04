# Shottr Quick Reference Guide

## Keyboard Shortcuts

### Capturing
- **Area Capture**: Default hotkey (configure in Shottr preferences)
- **Window Capture**: Hold Space while selecting
- **Full Screen**: Configure custom hotkey

### Annotation Tools
- **Arrow**: `A` key
- **Rectangle**: `R` key
- **Text**: `T` key
- **Line**: `L` key
- **Circle**: `O` key
- **Blur/Pixelate**: `B` key

### After Annotating
- **Copy**: `⌘C`
- **Save**: `⌘S`
- **Undo**: `⌘Z`

## Color Coding Convention for Alleato

Use consistent colors for clearer communication:

| Action | Color | Example |
|--------|-------|---------|
| **Remove** | Red | Red circle with X |
| **Move** | Blue | Blue arrow showing direction |
| **Add** | Green | Green text or box |
| **Change** | Orange | Orange label with new value |
| **Keep** | Yellow | Yellow highlight (rare) |

## Common UI Change Patterns

### 1. Spacing Changes
```
[Orange text label]: "mt-8" or "padding: 80px"
```

### 2. Component Replacement
```
[Red circle around Card] + [Text]: "replace with div"
```

### 3. Reordering Sections
```
[Blue arrow from current position to new position]
[Number labels]: 1, 2, 3 for sequence
```

### 4. Style Changes
```
[Orange label]: "text-blue-500" or "border rounded-lg"
```

## Template Messages for Claude

### Minimal (Fastest)
```
[screenshot]
Apply to: frontend/app/page.tsx
```

### With Context
```
File: frontend/app/page.tsx
Match Procore's style
[annotated screenshot]
```

### With Constraints
```
[screenshot]
File: frontend/app/page.tsx
Keep: TypeScript types, functionality
Use: ShadCN components only
```

## Pro Tips

1. **Zoom in** before capturing for better detail
2. **Include context** - show enough UI so position is clear
3. **Use text size 16-20** for annotations (readable in Claude)
4. **Avoid overlapping** annotations
5. **Number multiple changes** if order matters

## Troubleshooting

**Screenshot too large?**
- Capture specific sections instead of full page
- Use multiple screenshots for complex changes

**Claude not understanding?**
- Make annotations larger/clearer
- Add brief text description
- Use more distinct colors

**Changes in wrong order?**
- Number your annotations (1, 2, 3...)
- Or submit changes one at a time