# Improved Book Chatbot

This project includes an improved chatbot that is directly integrated into the existing book website. The chatbot has been enhanced for better usability with a larger size, expanded chat history, and improved styling.

## Improvements Made

### 1. Chat Widget Size
- **Increased overall size**: Widget is now 450px wide and 650px tall (previously 350px x 500px)
- **Larger input box**: Input area is now more spacious with 60px minimum height and vertical resizing
- **Enhanced send button**: Larger, more prominent button with hover effects and better visibility

### 2. Chat History Area
- **Expanded view**: Chat history area now has a minimum height of 450px (previously smaller)
- **Better visibility**: Can display approximately 10-12 messages at once without scrolling
- **Improved scrolling**: Smooth scrollable area with better visual hierarchy

### 3. Frontend Styling
- **Distinct message styling**:
  - User messages: Light blue background (#e3f2fd) with darker blue text
  - Bot messages: Light gray background (#f5f5f5) with dark text
- **Enhanced readability**: Larger font size (15px), better line height (1.5)
- **Visual improvements**: Subtle shadows, rounded corners, and better spacing
- **Responsive design**: Optimized for both desktop and mobile devices

### 4. User Experience
- **Better input experience**: Larger, more comfortable input area with resize capability
- **Visual feedback**: Hover effects on buttons, focus states, and interactive elements
- **Improved accessibility**: Better contrast ratios and touch targets

## Files Modified

### Frontend
- `src/components/Chatbot/Chatbot.css` - Updated styling for improved usability
- `src/components/Chatbot/Chatbot.js` - (if any JavaScript changes were needed)
- `src/theme/Layout/index.js` - Maintains integration with website

## How to Use

1. Ensure the backend server is running:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8001
   ```

2. Start the Docusaurus website:
   ```bash
   npm start
   ```

3. The improved chatbot will appear at the top-right of every page with:
   - Larger, more visible widget
   - Expanded chat history showing more messages
   - Larger input area for comfortable typing
   - Enhanced styling with distinct user/bot message colors

## Backend Compatibility

- The POST `/chat` endpoint remains unchanged
- All existing backend functionality is preserved
- The improvements are purely frontend-focused

## Mobile Responsiveness

- On mobile devices (under 768px), the widget adapts to 60% of viewport height
- Input areas and buttons remain appropriately sized for touch interaction
- Chat history area adjusts to maintain good visibility on smaller screens

## Integration Notes

The chatbot remains fully integrated into your existing book website and continues to:
- Load book content from the `/docs` directory
- Provide responses based solely on book content
- Maintain all existing functionality while offering improved usability