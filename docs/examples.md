
# examples


## pack and unpack

## ex1
<div class="codeBox codeSource">
 result = MBP.MB("bufferName","32", 1 )
</div>
<button class="codeButton">run</button>

<div class="codeBox codeResult">
 >
</div>

## ex2
<div class="codeBox codeSource">
result =  MBP.pack( MBP.MB("bufferName","32", 2 ) )
</div>
<button class="codeButton">run</button>

<div class="codeBox codeResult">
>
</div>



<script>
  const Buffer = MBP.Buffer;
  
  var result = ''
  console.log('hi')
  let codeList = document.querySelectorAll('.codeSource')
  let codeResultList = document.querySelectorAll('.codeResult')
  console.log( codeList[0].textContent )
  console.log( codeResultList[0].textContent )

  let buttons = document.querySelectorAll('.codeButton')



  buttons.forEach( (btn,index)=>{
    btn.addEventListener('click', e=>{
      // codeResultList[index].textContent =  codeList[index].textContent
       eval( codeList[index].textContent )
       console.log( 'eval', result)
      codeResultList[index].textContent =  JSON.stringify( result )

    })
  })

</script>