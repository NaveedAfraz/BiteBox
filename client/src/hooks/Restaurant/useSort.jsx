import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function useFilteredItems() {
  // Define filter state variables
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [foodType, setFoodType] = useState("");

  const fetchFilteredItems = async () => {
    const response = await axios.post(
      "http://localhost:3006/api/restaurant/sort",
      { search, sort, order, foodType },
      { withCredentials: true }
    );
    return response.data;
  };


  const query = useQuery({
    queryKey: ["filteredItems", { search, sort, order, foodType }],
    queryFn: fetchFilteredItems,
    enabled: false,
  });

  const refetch = () => {
    query.refetch();
  };
  const handleFilter = (filterType, value, buttonOrder) => {

    if (filterType == "clear") {
      setFoodType("");
      setSearch("");
      setSort("name");  // Reset to default sort
      setOrder("asc");
      setTimeout(() => { query.refetch() }, [100])
      return;
    }


    switch (filterType) {
      case "search":
        setSearch(value);
        break;
      case "sort":
        setSort(value);
        setOrder(buttonOrder || "asc");
        break;
      case "foodType":
        setFoodType(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (query.isFetching) return;
    query.refetch();
  }, [search, sort, order, foodType]);


  return {
    search,
    sort,
    order,
    foodType,
    refetch,
    setSearch,
    setSort,
    setOrder,
    setFoodType,
    handleFilter,
    ...query,
  };
}

export default useFilteredItems;
