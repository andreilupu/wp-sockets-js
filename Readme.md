# WIP / Only a PoC atm
I'm just putting thoughts out in the wild. I'm not even sure about the name.
Might be another dead side-project just as the [initial idea](https://github.com/andreilupu/socket)

# WP Sockets

Proof-of-concept of an Admin Settings page build with WordPress components only.

Key points of this framework:

* Simple & reliable.
* Build within WordPress with WordPress components, principles and coding standards.
* Flexible as much as possible.

## Description

Built with `@wordpress-scripts` for compiling and reuses `@wordpress/elements`/`@wordpress/components` as much as possible.

## How to use?

This repository handles only the Browser side of the framework which means that you will be responsible for registering and enqueuing assets.
If you simply want to create an Admin Page without too much headache you can use the (SocketsWP composer package)[#to-do] which will use the latest version of this package.

You can install it via npm with `npm install sockets-wp`

After that you will need to enqueue the style and assets on your admin page, which you will also need to create it on your PHP side.


```
// @TODO add an example.
```

Once you have an admin page with the style and script properly loaded you can create a SocketsWp componet.

```
import { createSocketsWpRoot } from 'sockets-wp';

createSocketsWpRoot( 'sockets_example', {
	selector: '.sockets-example-react-apps',
	sockets: [
		{
			id: 'text_example',
			type: 'text',
			label: 'Text',
		},
		{
			id: 'textarea_example',
			type: 'textarea',
			label: 'Textarea',
		},
	],
} );
```

Where the selector is a present element in your admin page.

Alternative

You can also use the SocketWP component yourself like this

```
import { createRoot } from '@wordpress/element';
import { SocketsWpApp } from 'sockets-wp';

let element = document.querySelector( '.selector' );

// if the element exists, render the app
if ( element ) {
	const root = createRoot( element );
	root.render(
		<SocketsWpApp id={ id } options={ options } sockets={ sockets } />
	);
}
```
