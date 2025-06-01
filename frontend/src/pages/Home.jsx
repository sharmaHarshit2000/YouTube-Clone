import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchAllVideos } from "../features/video/videoSlice";

const Home = () => {
    const dispatch = useDispatch();
    const { videos, loading } = useSelector((state) => state.videos);
    const { term } = useSelector((state) => state.search);
    const { isSidebarOpen } = useSelector((state) => state.ui);

    const [selectedFilter, setSelectedFilter] = useState("All");

    useEffect(() => {
        dispatch(fetchAllVideos());
    }, [dispatch]);

    const handleSelectedFilter = (filter) => {
        if(selectedFilter === filter) {
            setSelectedFilter("All")
        } else {
            setSelectedFilter(filter)
        }
    }

    const filteredVideo = useMemo(() => {
        let filtered
    })

}


export default Home;