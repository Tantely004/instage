import { Outlet } from "react-router-dom"
import Toolbar from "../../components/intern/ToolBar"

const LayoutIntern = () => {
    return (
        <div>
            <div>
                <Toolbar />
            </div>

            <main className="mt-4">
                <Outlet />
            </main>
        </div>
    )
}

export default LayoutIntern