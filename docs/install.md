
# Install

## Node.js

```js
npm i meta-buffer-pack
```

```js
// Node ES Module
import { MBP } from 'meta-buffer-pack'

// Node commonJS
const { MBP } = require('meta-buffer-pack')

```


## Browser

### IIFE script loading.

```html
/* 1. load script first */
<script src="./path/meta-buffer-pack.min.js"></script>
<script>
  // 2. Use global reference name: MBP 
  // 3. Use MBP.Buffer for Node Buffer.
  const Buffer = MBP.Buffer
  </script>
```


### Import ES Module
- bundled module file is inside dist folder.


Browser ES Module. 
```js
// Do not forget the file extension '.js'
import { MBP, Buffer } from './path/meta-buffer-pack.esm.js'

```
