# Yallery

**Package is in alpha - production use is not recomended for now**
<br/><br/>
Yallery is [Ymage](https://github.com/ylfe-dev/Yallery) based react gallery component focused on advenced automation, smooth layout adjustments and fast image rendering even in "wild" situations when you can't provide image diemnsions before fetching them.

✅ Advenced progressive JPEG recognition - image is rendered on first progressive scan avaiable - before `onLoad`.  <br/>
✅ Sized, neat image placeholder<br/>
✅ Short props for styling<br/>
✅ Image copy protection<br/>
✅ All image  formats are compatible - progressive JPEG is just recommended way<br/>




## Installation


```shell
$ npm install yallery
```

Import module to `yourcode.js`:
```JavaScript
import {Yallery} from 'yallery'
```

## Usage


```JavaScript
<Yallery images={image_array} options={opt}/>
```


<br/>

