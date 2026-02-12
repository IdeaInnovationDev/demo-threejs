# 3D CAD Web Application - 教育用3D設計ツール

A web-based 3D CAD application built with Three.js for educational purposes, specifically designed for middle school technology classes.

## Features

### 2D Shape Creation
- **Rectangle**: Create rectangular 2D shapes
- **Circle**: Create circular 2D shapes  
- **Polygon**: Create hexagonal 2D shapes

### 3D Operations
- **Extrude to 3D**: Convert any 2D shape into a 3D object with adjustable height
- Create wooden frame designs for educational projects

### Transform Tools
- **Move**: Move objects in 3D space using arrow keys
- **Rotate**: Rotate objects around their axes
- **Scale**: Scale objects up or down

### Material System
- **Color Picker**: Choose any color for your objects
- **Wood Presets**: Quick access to common wood colors
  - Wood Brown (#8B4513)
  - Light Wood (#D2691E)
  - Dark Wood (#A0522D)
  - Beige (#DEB887)

### Object Management
- **Select**: Click on objects to select them
- **Delete**: Remove selected objects
- **Clear All**: Clear the entire scene
- **Export**: Save your design as JSON

### View Controls
- **Orbit Camera**: Right-click and drag to rotate view
- **Zoom**: Scroll to zoom in/out
- **Pan**: Middle-click and drag to pan
- **Reset Camera**: Return to default view
- **Toggle Grid**: Show/hide the grid and axes

## Usage

### Basic Workflow
1. **Create 2D Shape**: Click on Rectangle, Circle, or Polygon button
2. **Position**: The shape will appear on the grid
3. **Select**: Click on the shape to select it (green outline appears)
4. **Extrude**: Set the extrusion height and click "Extrude to 3D"
5. **Transform**: Use Move/Rotate/Scale modes with arrow keys
6. **Customize**: Change colors using the color picker
7. **Export**: Save your design when finished

### Keyboard Shortcuts
When an object is selected:
- **Delete/Backspace**: Delete selected object
- **Arrow Keys**: Move/Rotate based on active mode
- **+/-**: Move up/down (Move mode)
- **Shift + Arrow**: Larger steps

### Mouse Controls
- **Left Click**: Select object
- **Right Click + Drag**: Rotate camera view
- **Middle Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out

## Technical Details

### Technologies Used
- **Three.js r137**: 3D graphics library (security patched version)
- **OrbitControls**: Camera control system
- **Vanilla JavaScript**: No framework dependencies
- **HTML5 Canvas**: Rendering context

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

### File Structure
```
demo-threejs/
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── app.js              # Three.js application logic
├── README.md           # Documentation
├── package.json        # Project dependencies
├── .gitignore          # Git ignore rules
└── libs/               # Third-party libraries
    ├── three.min.js    # Three.js library
    └── OrbitControls.js # Camera controls
```

## Educational Purpose

This application is designed for:
- Middle school technology education
- Teaching 3D design concepts
- Understanding 2D to 3D transformation
- Woodworking project planning
- Spatial reasoning development

## Export Format

Designs are exported as JSON with the following structure:
```json
{
  "objects": [
    {
      "type": "rectangle",
      "is2D": false,
      "position": [x, y, z],
      "rotation": [x, y, z],
      "scale": [x, y, z],
      "color": "#8B4513"
    }
  ]
}
```

## Future Enhancements

Potential improvements:
- Import JSON designs
- More shape types (triangle, custom polygons)
- Snap to grid functionality
- Measurement tools
- Assembly/grouping of objects
- Texture mapping for realistic wood grain
- STL export for 3D printing
- Undo/Redo functionality

## License

Open source - feel free to use and modify for educational purposes.

## Support

For issues or questions, please open an issue on the GitHub repository.
