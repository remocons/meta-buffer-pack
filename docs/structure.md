
# Structure of Meta Buffer Pack (binary Pack)

## pack with frame info.

  > pack = [Buffers,,,]+[Frame]+[Tail]    // a buffer appended frame and tail info.

* Frame is JSON format data that contains meta information of buffers.
* Tail is two bytes size info of the JSON data.


```js 
  pack = [ Buffer: buf1 + buf2 + bufN ]+[,Frame:JSON]+[,Tail: 2bytes ]
 
```
* You can use 
 - getBuffer() to get the raw buffer.
 - getFrame()  to get the buffer info object.
 
## pack without frame info.

```js
  pack = [buf1,bu2,bunN]  //  only buffer.
```
  * Frame and Tail data is optional.
  * some MBP pack has no Frame and Tail info. 
  * In this case, getFrame() will return undefined.
