import { Outlet } from 'react-router-dom';
import tw from 'twin.macro';
import logo from './Assets/Logo.png'

function App() {



  return (
    <Wrapper>
      <NavBar>
        <LogoImg  src={logo} alt="Logo" />

      </NavBar>
      
      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  )
}

export default App;

const Wrapper = tw.div`fixed w-full h-full bg-zinc-800`
const NavBar = tw.nav`flex items-center px-4 py-8 bg-zinc-900 justify-between`
const Content = tw.div`mx-auto max-w-7xl mt-4 h-full text-white`
const LogoImg = tw.img`aspect-[8.875] w-[60%] max-w-[300px]`



