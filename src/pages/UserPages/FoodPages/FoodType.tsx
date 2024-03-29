import { useState,useEffect} from "react"
import { useParams } from "react-router-dom"
import productAPI, { ProdItem } from "../../../api/productAPI"
import { ProductCard } from "../../../components/UserComponents/Food"
import { Select } from "@chakra-ui/react"
import { usePanigation } from "../../../hooks/index"

const FoodType = () => {
  const {food_type} = useParams()
  const {pageNum,pageSum,changePage,setPageSum} = usePanigation()
  const [productByType,setProductByType] = useState<ProdItem[]>([])
  useEffect(() =>{
    const getFoodType = async () => {
      try{
         const response = await productAPI.getPageByType(food_type,pageNum)
         setProductByType(response.data)
         setPageSum(response.pageSum)
      }
      catch(err){
        console.log('Không thể lấy danh sách sản phẩm',err)
      }
    }
    getFoodType()
  },[food_type, pageNum, setPageSum])
  const [selected, setSelected] = useState()
  const handleChange = (e: any) => {
    if(e.target.value === 'prices-up'){
      const pricesGoUp = productByType.sort((a,b)=>a.prodPrice - b.prodPrice)
      setSelected(e.target.value)
      setProductByType(pricesGoUp)
    }
    else if(e.target.value === 'prices-down') {
      const pricesGoDown = productByType.sort((a,b)=>b.prodPrice - a.prodPrice)
      setSelected(e.target.value)
      setProductByType(pricesGoDown)
    }
  }
return (
  <section className='mt-10 lg:px-5'>
    <div className='mb-8 ml-2 inline-block w-[200px]'>
      <Select placeholder='Sắp xếp theo' 
       borderColor='#ff5e57'
       focusBorderColor='#ff5e57'
       color='#576574'
       className='cursor-pointer'
       value = {selected}
       onChange = {handleChange}
       >
        <option key='prices-up' value='prices-up'>Giá tăng dần</option>
        <option key='prices-down' value='prices-down'>Giá giảm dần</option>
      </Select>
    </div>
    <div className='grid grid-cols-4 gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
      <ProductCard productList={productByType}/>
    </div> 
    <div className='mt-10 flex justify-center'>    
     <nav className='text-[16px] cursor-pointer'>
      <ul className="inline-flex items-center -space-x-px">
        <li onClick={()=>changePage(pageNum-1)} className='px-1'>
          <span className="block px-3 py-2 ml-0 text-maintext hover:text-maincolor duration-200" style={pageNum === 1 ? {cursor:'not-allowed'} : {}}>
          <i className="fa-solid fa-chevron-left"></i>
          </span>
        </li>
        {[...Array(pageSum)].map((item,index)=>(
          <li onClick={()=>changePage(index+1)} key={index} className='px-1'>
          <span className="px-3 py-1 text-maintext hover:text-maincolor duration-200" 
          style={pageNum===index +1 ? {color: 'white',backgroundColor:'#00aaee',borderRadius:'5px'} : {}}>{index+1}</span>
        </li>
        ))}
        <li onClick={()=>changePage(pageNum+1)} className='px-1'>
          <span className="block px-3 py-2 text-maintext hover:text-maincolor duration-200" style={pageNum === pageSum ? {cursor:'not-allowed'} : {}}>
          <i className="fa-solid fa-chevron-right"></i>
          </span>
        </li>
      </ul>
    </nav>
   </div>
  </section> 
  )
}
export default FoodType