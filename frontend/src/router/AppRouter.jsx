import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";

const AppRouter = () => {

    <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/video/:videoId" element={<VideoWatchPage />} />
        <Route path="/channel/:id" element={<ChannelPage />} />

    </Routes>
}


export default AppRouter;