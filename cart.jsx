// simulate getting products from DataBase
const products = [
  { name: "Apples:", country: "Italy", cost: 3, instock: 10 },
  { name: "Oranges:", country: "Spain", cost: 4, instock: 3 },
  { name: "Beans:", country: "USA", cost: 2, instock: 5 },
  { name: "Cabbage:", country: "USA", cost: 1, instock: 8 },
];
//=========Cart=============
const Cart = (props) => {
  const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : products;
  console.log(`data:${JSON.stringify(data)}`);

  return <Accordion defaultActiveKey="0">{list}</Accordion>;
};

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log("FETCH FROM URl");
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Products = (props) => {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const {
    Card,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Image,
    Input,
    ListGroup, //CMB
  } = ReactBootstrap;
  //  Fetch Data
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");  //This requires an Strapi server running to work, CMB
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );
  console.log(`Rendering Products ${JSON.stringify(data)}`);
  // Fetch Data
  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name == name);
    console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
    //doFetch(query);
  };
  const deleteCartItem = (index) => {
    let newCart = cart.filter((item, i) => index != i);
    setCart(newCart);
  };
  const photos = ["apple.png", "orange.png", "beans.png", "cabbage.png"];

  //======= Products List =======
  //let list = items.map((item, index) => {
    //let n = index + 1049;
    //let url = "https://picsum.photos/id/" + n + "/50/50";

  //  return (
  //    <li key={index}>
  //      <Image src={photos[index % 4]} width={70} roundedCircle></Image>
  //      <Button variant="primary" size="large">
  //        {item.name}:{item.cost}
  //      </Button>
  //      <input name={item.name} type="submit" onClick={addToCart}></input>
  //    </li>
  //  );
  //});
  
  let list = items.map((item, index) => {
    //let n = index + 1049;
    //let url = "https://picsum.photos/id/" + n + "/50/50";

    return (
      <li key={index}>
        <Image src={photos[index % 4]} width={70} roundedCircle></Image>
        <Button className="m-1" variant="primary" size="large" disabled>
          {item.name}
        </Button>
        <Button className="m-1" variant="dark" size="large" disabled>
          {item.country}
        </Button>
        <Button className="m-1" variant="info" size="large" disabled>
          {item.cost}
        </Button>
        <Button name={item.name} className="btn btn-success" onClick={addToCart}> Add </Button>
      </li>
    );
  });



  // ============ Cart Content ============
  //let cartList = cart.map((item, index) => {
  //  return (
  //    <Card key={index}>
  //      <Card.Header>
  //        <Accordion.Toggle as={Button} variant="link" eventKey={1 + index}>
  //          {item.name}
  //        </Accordion.Toggle>
  //      </Card.Header>
  //      <Accordion.Collapse
  //        onClick={() => deleteCartItem(index)}
  //        eventKey={1 + index}
  //      >
  //        <Card.Body>
  //          $ {item.cost} from {item.country}
  //        </Card.Body>
  //      </Accordion.Collapse>
  //    </Card>
  //  );
  //});

  let cartList = cart.map((item, index) => {
    return (
      <Card className="m-2" key={1+index}>                
        <Accordion.Item eventkey={1+index}>
          <Accordion.Header variant="link" eventkey={1+index}>
            {item.name}
          </Accordion.Header>
          <Accordion.Body eventkey={1+index}>
            From {item.country}: ${item.cost}
            <hr />
            <Button className="btn btn-danger" onClick={() => deleteCartItem(index)} eventkey={1+index}>
              Delete
            </Button>
          </Accordion.Body>
        </Accordion.Item>        
      </Card>
    );
  });

// ========= Check Out ============  
  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        //<div key={index} index={index}>
        //  {item.name}
        //</div>
        <ListGroup.Item key={index} index={index}>
          {item.name}: ${item.cost}
        </ListGroup.Item>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
    //return newTotal.toFixed(2);
  };
  // TODO: implement the restockProducts function
  const restockProducts = (url) => {
    doFetch(url);    
      let newItems = data.map((item) => {
        let { name, country, cost, instock } = item;
        return { name, country, cost, instock };
      });
      setItems([...items, ...newItems]);
  };

  return (
    <Container>
      <Row>
        <Col xs={6}>
          {/*<h1>Product List</h1> -->
          <ul style={{ listStyleType: "none" }}>{list}</ul>*/}
          <Card className="card border-primary m-1">
            <Card.Header>Stock</Card.Header>
            <ul style={{ listStyleType: "none" }}>{list}</ul>
          </Card>
        </Col>
        <Col>
          {/*<h1>Cart Contents</h1>
          <Accordion>{cartList}</Accordion>*/}
          <Card className="text-center border-info m-1 card">
            <Card.Header>Cart</Card.Header>
            <Accordion>{cartList}</Accordion>
          </Card>
        </Col>
        <Col>
          {/*<h1>CheckOut </h1>*/}
          <Card className="text-black text-center m-1 card bg-warning">
            <Card.Header>CheckOut</Card.Header>
            <ListGroup variant="flush">
              {finalList().total > 0 && finalList().final}
            </ListGroup>
            <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          </Card>
          {/*<div> {finalList().total > 0 && finalList().final} </div>*/}
        </Col>
      </Row>

      <Row>
        <form
          onSubmit={(event) => {
            restockProducts(`http://localhost:1337/api/${query}`);
            //restockProducts(`${query}`);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            
          />
          <Button className="btn-warning" type="submit">ReStock Products</Button>
        </form>
      </Row>
    </Container>
  );
};
// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
