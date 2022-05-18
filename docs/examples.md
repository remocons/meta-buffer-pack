
# examples


## pack and unpack

## MB and MBP.pack()


```js
let pack = MBP.pack( 
    MBP.MB("v1","32", 0xffffffff ),
    MBP.MB("v2","16", 0xaaaa ),
    MBP.MB("v3","16", 0xbbbb ),
    MBP.MB("v4","16", 0xcccc )
  )

displayTo( view, parsePackToHTML(pack) )

```

<button class="codeButton">run</button>
<div id="view"></div>
<div class="codeBox codeResult">
 >
</div>

## ex2



```js
result =  MBP.pack( MBP.MB("bufferName","32", 2 ) )
```

<button class="codeButton">run</button>

<div class="codeBox codeResult">
>
</div>



<script>
  const Buffer = MBP.Buffer;

  
  var result = ''
  console.log('example page init.')
  // let codeList = document.querySelectorAll('.codeSource')
  let codeList = document.querySelectorAll('.lang-js')
  codeList[0].setAttribute('contenteditable', true )
  let codeResultList = document.querySelectorAll('.codeResult')
  console.log( codeList[0].textContent )
  console.log( codeResultList[0].textContent )

  function parsePackToHTML( pack ){

    let fullHex = MBP.hex(pack)
    // fullHex = fullHex.toUpperCase()
    let metaInfo = MBP.getMetaDetail( pack )
      console.log('metaInfo',metaInfo )
      console.log('fullHex', fullHex )
    let tags = "";    

    metaInfo.forEach( (item,index)=>{
       let offset = item[2] * 2
       let indexEnd = offset + item[3] * 2
      let itemHex = fullHex.substring( offset, indexEnd )

      let hexArr = itemHex.split("")
      let itemBytes ="";
      for( i = 0; hexArr.length; i+=2 ){
        let nibbleHigh = hexArr.shift()
        let nibbleLow = hexArr.shift()
         itemBytes += `<span class="hex">${nibbleHigh}${nibbleLow}</span>`        
      }


      tags += `<span class="buf">${itemBytes}</span>`
    })

  console.log('parsedHTML', tags )
    return tags
  }
  function displayTo( target, tag ){
      target.innerHTML = tag 
  }

  let buttons = document.querySelectorAll('.codeButton')

  buttons.forEach( (btn,index)=>{
    btn.addEventListener('click', e=>{
      // codeResultList[index].textContent =  codeList[index].textContent
       eval( codeList[index].textContent )
      //  Function( codeList[index].textContent )();
      
      // codeResultList[index].textContent =  JSON.stringify( result )
     // codeResultList[index].textContent += result 
    
    })
  })

</script>