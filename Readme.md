# WP Sockets (JS)

A flexible, React-based library for building WordPress Admin Pages using native WordPress components.

## Overview

`@wp-sockets/js` provides a declarative way to build complex WordPress admin interfaces using a "socket" architecture. It leverages standard `@wordpress/components` to ensure your admin pages look and feel native to WordPress.

## Features

*   **Native Look & Feel**: Built on top of `@wordpress/components`.
*   **Declarative Configuration**: Define your UI structure using simple JSON-like objects.
*   **Extensible**: Easily register custom socket types.
*   **State Management**: Built-in data helpers for handling options and user meta.
*   **Responsive**: Built-in responsive grid system.

## Installation

```bash
npm install @wp-sockets/js
```

## Usage

### 1. Enqueue Assets (PHP)

First, ensure you have a WordPress admin page registered and assets enqueued. You can use the companion PHP library (coming soon) or manually enqueue your script.

### 2. Initialize the App (JS)

In your JavaScript entry point:

```javascript
import { createSocketsWpRoot } from '@wp-sockets/js';

// Configuration for your admin page
const config = {
    selector: '#my-admin-page-root', // The DOM element ID
    mode: 'tabs', // 'tabs' or 'panel'
    title: 'My Admin Page',
    withSaveButton: true,
    autosave: false,
    sockets: [
        {
            id: 'general_settings',
            type: 'group',
            label: 'General Settings',
            children: [
                {
                    id: 'my_text_field',
                    type: 'text',
                    label: 'Example Text Field',
                },
                {
                    id: 'my_textarea',
                    type: 'textarea',
                    label: 'Description',
                }
            ]
        }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createSocketsWpRoot('my_app_id', config);
});
```

## Available Socket Types

*   `text`: Simple text input.
*   `textarea`: Textarea input.
*   `group`: Container for other sockets, supports grid layouts.
*   `repeater`: Repeatable list of sockets.

## License

GPL-2.0-or-later
