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

## Requirements

**WordPress 7.0 or newer.**

This version bundles core's DataForms (`@wordpress/dataviews`), whose dependency
chain needs the `wp-theme` script handle — WordPress 7.0 registers it, 6.8 does
not. On an older WordPress the script's dependency chain cannot resolve, so
WordPress prints nothing at all and the admin page comes up blank. Host
integrations should therefore check support before enqueueing and show a notice
instead; see [Enforcing the requirement](#enforcing-the-requirement).

If you need to support WordPress 6.x, stay on `0.1.0-alpha.4`.

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
*   `number`: Number input.
*   `group`: Container for other sockets, supports grid layouts.
*   `repeater`: Repeatable list of sockets.
*   `dataform`: Renders its children with core's DataForms. See below.

## The `dataform` socket (experimental)

`dataform` renders its children through `DataForm` from
`@wordpress/dataviews` — the same form component core is standardising on —
instead of the hand-rolled socket controls. It is opt-in per socket, so a page
can adopt DataForms one section at a time:

```php
[
    'id'       => 'connection',
    'type'     => 'dataform',
    'label'    => 'Connection',
    'layout'   => 'regular', // regular | panel | card | row
    'children' => [
        [ 'id' => 'api_url', 'type' => 'text',     'label' => 'API URL' ],
        [ 'id' => 'enabled', 'type' => 'checkbox', 'label' => 'Enabled' ],
        [
            'id'      => 'model',
            'type'    => 'select',
            'label'   => 'Model',
            'choices' => [ 'fast', 'accurate' ],
        ],
    ],
]
```

What carries over unchanged:

*   **Persistence.** `DataForm` is a controlled component, so the existing
    `dataHelper` remains the owner of state — the option, user-meta and
    apiFetch helpers all keep working, as does the save button.
*   **Custom socket types.** A child whose type has no native DataForms
    equivalent is still resolved through the
    `{appId}Sockets.socketType{Type}` filter and rendered as a DataForms
    custom control, so existing custom sockets need no changes.
*   **Nothing is dropped.** `repeater` and `object` children cannot be
    expressed as DataForms fields, so they are rendered after the form by the
    normal WP Sockets renderer.

### Stylesheet

The package exports its stylesheet, which also carries the DataViews styles the
`dataform` socket needs. Import it in your own entry point so it is emitted into
your plugin's build:

```js
import '@andreilupu/wp-sockets-js/style.css';
```

Prefer this over enqueueing `node_modules/.../dist/index.css` directly: that
directory is a build-time artifact that should not be web-served, and it does
not resolve with linked or hoisted installs.

### Requirements and caveats

*   **Needs WordPress 7.0+**, like the rest of this version — see
    [Requirements](#requirements).

*   **The runtime guard is not backward compatibility.** `canUseDataForms()`
    checks for the host singletons and the socket degrades to the standard
    socket renderer when they are missing, and the DataForm is wrapped in an
    error boundary that degrades the same way rather than showing a dead panel.
    That protects against DataViews failing *once loaded*; it cannot help on
    WordPress 6.8, where the script never executes at all. Enforce the version
    requirement in PHP, do not rely on this.
*   **Bundle size.** Bundling DataViews grows the WordPress build from ~119 KB
    to ~255 KB of JS and adds ~89 KB of CSS. A future version should load it on
    demand so pages that do not use the socket pay nothing.
*   **Values are flattened.** DataForms keeps a flat field list, so a `group`
    nested inside a `dataform` contributes its children to the same value
    namespace and only nests visually.
*   The DataForms field API is still stabilising upstream, so treat this socket
    as experimental and keep `@wordpress/dataviews` pinned.

## Enforcing the requirement

Because an unsupported WordPress produces a blank page rather than an error,
check for support before enqueueing and tell the user what is wrong. Test for the
capability rather than the version number, so a site running the Gutenberg plugin
over an older core is judged correctly:

```php
function myplugin_supports_wp_sockets() {
	// `wp-theme` is the handle DataViews' dependency chain needs; WordPress 7.0
	// registers it, 6.8 does not.
	return wp_script_is( 'wp-theme', 'registered' );
}

add_action( 'admin_enqueue_scripts', function () {
	if ( ! myplugin_supports_wp_sockets() ) {
		return; // Enqueueing anyway prints nothing and renders a blank page.
	}
	// ... enqueue as usual
} );

add_action( 'admin_notices', function () {
	if ( myplugin_supports_wp_sockets() ) {
		return;
	}
	printf(
		'<div class="notice notice-error"><p>%s</p></div>',
		esc_html__( 'My Plugin needs WordPress 7.0 or newer.', 'myplugin' )
	);
} );
```

The `examples/npm-plugin` example in
[wp-sockets-examples](https://github.com/andreilupu/wp-sockets-examples) does
exactly this.

## Data helper API: `setSettings`

Data helpers now expose `setSettings( { id: value, ... } )` alongside
`setSetting( id, value )`, and **anything that can change more than one setting
at a time must use it**.

`setSetting` spreads the settings snapshot captured during the current render,
so calling it in a loop silently discards every change but the last. The batch
setter applies them as a single edit. Custom data helpers that do not implement
`setSettings` still work — the `dataform` socket falls back to `setSetting`.

## License

GPL-2.0-or-later
