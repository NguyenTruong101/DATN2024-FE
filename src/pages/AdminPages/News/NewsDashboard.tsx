import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import { useState,useEffect,useRef, useContext, ChangeEvent } from "react"
import { Link } from "react-router-dom"
import newsAPI, { NewsItem } from "../../../api/newsAPI"
import { FoodContext } from "../../../context/FoodContext/FoodContext"
import { usePanigation } from "../../../hooks"
import { convertDate } from "../../../utils/convertDate"

const NewsDashboard = () => {
  const {setNewsItem} : any = useContext(FoodContext)
  const {pageNum,pageSum,changePage,setPageSum} = usePanigation()
  const toast = useToast()
  const {isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef(null)
  const [newsList,setNewsList] = useState<NewsItem[]>([])
  const [newsId,setNewsId] = useState()
  useEffect(() =>{
    const getNewsItem = async () => {
      try{
         const response = await newsAPI.getPageNews(pageNum)
         setNewsList(response.data)
         setPageSum(response.pageSum)
      }
      catch(err){
        console.log('Không thể lấy danh sách tin tức',err)
      }
    }
    getNewsItem()
  },[pageNum, setPageSum])
  const getNewsId = (newsId : any) => {
    setNewsId(newsId)
    onOpen()
  }
  const deleteNews = async () => {
    try{
      await newsAPI.delNews(newsId)
      setNewsList(newsList.filter(item=>item._id !== newsId ))
      toast({
        position: 'top',
          title: 'Thành công',
          description: "Xóa tin tức thành công",
          status: 'success',
          duration: 5000,
          isClosable: true,
      })
      onClose()
    }
    catch(err){
      console.log('Xóa tin không thành công',err)
      toast({
        position: 'top',
          title: 'Có lỗi',
          description: "Xóa tin tức không thành công",
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      onClose()
    }
  }
  const [input,setInput] =useState('')
  const handleInputChange = (e : ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }
  return (
    <section>
      <div className='flex justify-between items-center mb-7 md:block'>
        <div>
          <Link to='/admin/admin-tintuc/them' className='bg-sky-600 text-white py-2 px-2 rounded-[5px] cursor-pointer hover:brightness-90 duration-200'>Thêm tin tức</Link>  
        </div>
        <div className='md:mt-5'>
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='#8AAAE5' />}
          />
          <Input 
            type='search' 
            variant='outline' 
            placeholder='Tìm tin tức...' 
            className='cursor-pointer text-maintext' 
            htmlSize={30} width='auto'
            focusBorderColor='#8AAAE5'
            onChange={handleInputChange}
            />
          </InputGroup>
        </div>
      </div>
      <section>      
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-maintext">
                <thead className="text-xs text-white uppercase bg-sky-600">
                    <tr>
                        <th scope="col" className="py-3 px-6 w-[5%]">
                              STT
                         </th>
                         <th scope="col" className="py-3 px-6">
                              Tiêu đề
                         </th>
                          <th scope="col" className="py-3 px-6">
                              Ảnh 
                         </th>
                         <th scope="col" className="py-3 px-6">
                              Người đăng
                         </th>
                         <th scope="col" className="py-3 px-6">
                              Ngày đăng
                         </th>
                         <th scope="col" className="py-3 px-6">
                              Chỉnh sửa lần cuối
                         </th>
                         <th scope="col" className="py-3 px-6 w-[5%]">
                              Sửa
                         </th>
                         <th scope="col" className="py-3 px-6 w-[5%]">
                              Xóa
                         </th>
                    </tr>
                </thead>
                  <tbody>
                    {newsList.filter(item => {
                      if(input === '') return item
                      else if (item.newsTitle.toLowerCase().includes(input.toLowerCase())) return item
                      return null
                    }).map((item,index)=>(
                     <tr className="border-b" key={item._id}>
                        <td className="py-2 px-6 font-medium whitespace-nowrap">{index+1}</td>
                        <td onClick={()=>setNewsItem(item)} className="py-2 px-6 hover:text-sky-600 hover:underline">
                          <Link to={`/admin/admin-tintuc/${item._id}`}>{item.newsTitle}</Link>
                        </td>
                        <td className="py-2 px-6">
                        <img className='h-[50px] w-[50px] object-cover rounded-[10px]' src={item.imgNews} alt={item.newsTitle} loading='lazy'/>
                        </td>
                        <td className="py-2 px-6">{item.editor}</td>
                        <td className="py-2 px-6">{convertDate(item.createdAt)}</td>
                        <td className="py-2 px-6">{convertDate(item.updatedAt)}</td>
                        <td className="py-2 px-6">
                          <Link to='/admin/admin-tintuc/capnhat' className="font-medium text-blue-600 hover:underline">
                            <span onClick={()=>setNewsItem(item)}>Sửa</span>
                          </Link>
                        </td>
                        <td className="py-2 px-6">
                            <span onClick={()=>getNewsId(item._id)} className="font-medium text-blue-600 hover:underline cursor-pointer">Xóa</span>
                        </td>
                     </tr>
                    ))}
                  </tbody>
              </table>
          </div>
      </section>
      <div className='mt-10 flex justify-center'>    
        <nav className='text-[16px] cursor-pointer'>
        <ul className="inline-flex items-center -space-x-px">
          <li onClick={()=>changePage(pageNum-1)} className='px-1'>
            <span className="block px-3 py-2 ml-0 text-maintext hover:text-sky-600 duration-200" style={pageNum === 1 ? {cursor:'not-allowed'} : {}}>
          <i className="fa-solid fa-chevron-left"></i>
            </span>
          </li>
          {[...Array(pageSum)].map((item,index)=>(
            <li onClick={()=>changePage(index+1)} key={index} className='px-1'>
              <span className="px-3 py-1 text-maintext hover:text-sky-600 duration-200" 
               style={pageNum === index +1 ? {color: 'white',backgroundColor:'#8AAAE5',borderRadius:'5px'} : {}}>{index+1}</span>
              </li>
            ))}
          <li onClick={()=>changePage(pageNum+1)} className='px-1'>
            <span className="block px-3 py-2 text-maintext hover:text-sky-600 duration-200 " style={pageNum === pageSum  ? {cursor:'not-allowed'} : {}}>
            <i className="fa-solid fa-chevron-right"></i>
            </span>
          </li>
        </ul>
        </nav>
      </div>
      <div>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className='text-maintext'>
          <ModalHeader>Xóa tin tức</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            Bạn muốn xóa tin tức này?
          </ModalBody>
          <ModalFooter>
            <Button onClick={deleteNews}>Xóa</Button>
              <Button mr={3} ml={2} onClick={onClose}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </div>
    </section>
  )
}
export default NewsDashboard