import { useState,useEffect } from "react"
import menuAPI, { MenuItem } from "../../../api/menuAPI"
import {Link} from "react-router-dom"

const HomeCategory = () => {
  const [menu,setMenu] = useState<MenuItem[]>([])
  useEffect(() =>{
    const getMenuItem = async () => {
      try{
         const response = await menuAPI.getMenuItem()
         setMenu(response)
      }
      catch(err){
        console.log('Ko the lay danh sach menu item',err)
      }
    }
    getMenuItem()
  },[])
  return (
    <section className='lg:px-5'>
       <h1 className='text-[40px] md:text-[30px] sm:text-[25px] overflow-hidden py-5 relative font-semibold text-sky-600'>Danh mục món ăn</h1>
       <div className='grid grid-cols-4 gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
       {menu?.map((item,index)=>(
       <Link to={`/thuc-don/${item.menuType}`} key={item._id}>
        <div className='border-[1px] rounded-[10px] shadow-md cursor-pointer'>
        <div className='relative pt-[100%] md:pt-[60%] overflow-hidden rounded-t-[10px]'>
          <img className='absolute top-0 left-0 h-full w-full object-cover rounded-t-[10px]' src={item.imgMenu} alt={item.menuType} />
      </div>
      <div className='text-maintext p-2'>
        <span className='text-[25px] md:text-[20px] font-semibold overflow-hidden whitespace-nowrap text-ellipsis'>{item.menuType}</span>
        <span><i className="fa-solid fa-chevron-right ml-3"></i></span>
      </div>
      </div>
       </Link>
      ))}
    </div>
    </section>
  )
}
export default HomeCategory