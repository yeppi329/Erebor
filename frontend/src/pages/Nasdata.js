import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import axios from "axios";
import {TextField,Button,Box,Checkbox,Typography,Link,Paper,} from "@mui/material";
import {Toolbar,List,Divider,IconButton,Grid,Container,} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TreeView, TreeItem } from "@mui/lab";
import { BaseUrlContext } from "../index";
import MainListItems from "../components/listitems";
import {Card,CardMedia,CardActions,CardContent,Scrollbar,} from "@mui/material";
import Tag from "./Tag";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
const DataDisplay = () => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const navigate = useNavigate();
  const logout = () => {
    // Perform logout logic here
    navigate("/");
  };
  const [treeviewData, setTreeviewData] = useState([]);
  const [editingNodeId, setEditingNodeId] = useState("");
  const [editingLabel, setEditingLabel] = useState("");
  const BASE_URL = useContext(BaseUrlContext);
  const [selectedClassNames, setSelectedClassNames] = useState([]);
  const [imageView, setimageView] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/treeview`);
      setTreeviewData(response.data.treeviewData);
      console.log("데이터 가져오기 성공:", response.data.treeviewData);
      console.log("데이터 가져오기 성공 data:", response.data);
      // console.log(
      //   "데이터 가져오기 성공 data.children:",
      //   response.data.treeviewData[0].children
      // );
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  const handleEditNode = (label, nodeId) => {
    setEditingNodeId(nodeId);
    setEditingLabel(label);
  };

  const handleSaveNodeLabel = async (label, depth, nodeId) => {
    const nodeIdParts = nodeId.split("_"); // nodeId를 '_'로 구분하여 분리
    const id = nodeIdParts[0]; // node.id를 추출
    console.log("id", id);

    try {
      console.log(`${label}를 ${editingLabel}로 수정하고 뎁스는 ${depth}`);
      const response = await axios.post(
        `${BASE_URL}/api/data/update/${depth}/${label}/${editingLabel}/${id}`,
        {
          depth: depth,
          label: label,
          editingLabel: editingLabel,
          id: id, // node.id만 전달
        }
      );
      console.log("백에서의 응답", response.data);
      alert(`${label}를 ${editingLabel}로 수정 하셨습니다.`);
      setEditingNodeId(null);
      fetchData();
    } catch (error) {
      console.error("Label update failed:", error);
    }
  };

  const handleCancel = () => {
    setEditingNodeId(null);
  };

  const handleInputChange = (event) => {
    setEditingLabel(event.target.value);
  };
  const handleShowSelectedValues = () => {
    console.log("Selected Class Names:", selectedClassNames);
    handleDownloadCSV();
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/download-csv`,
        selectedClassNames,
        { responseType: "blob" }
      );

      const csvData = new Blob([response.data], { type: "text/csv" });
      const csvUrl = URL.createObjectURL(csvData);
      const link = document.createElement("a");
      link.href = csvUrl;
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("CSV download failed:", error);
    }
  };

  const createTreeItems = (data) =>
    data.map((node) => {
      const nodeId = `${node.id}_${node.text}`; // parentId와 node.id로 nodeId 조합
      if (node.Depth == "ClassName") {
        if(node.Depth == "ClassName")
        return (
          <div key={node.id} style={{ maxHeight: "500px", overflow: "auto" }}>
            <TreeItem
              key={node.id}
              nodeId={nodeId}
              label={createNodeLabel(node, nodeId)}
              onClick={() => {
                handleTreeItemClick(node.text, node.Depth, node.id);
                console.log(
                  "클릭한 애 node.text:",
                  node.text,
                  " 클릭한 애 node.children :",
                  node.children,
                  " 클릭한 애 node :",
                  node,
                  " 클릭한 애 node.Depth :",
                  node.Depth
                );
              }}
            >
              {node.children && createTreeItems(node.children, nodeId)}
            </TreeItem>
          </div>
        );
      } else {
        return (
          <TreeItem
            key={node.id}
            nodeId={nodeId}
            label={createNodeLabel(node, nodeId)}
            onClick={() => {
              handleTreeItemClick(node.text, node.Depth, node.id);
              console.log(
                "클릭한 애 node.text:",
                node.text,
                " 클릭한 애 node.children :",
                node.children,
                " 클릭한 애 node :",
                node,
                " 클릭한 애 node.Depth :",
                node.Depth
              );
            }}
          >
            {node.children && createTreeItems(node.children, nodeId)}
          </TreeItem>
        );
      }
    });
  const handleTreeItemClick = async (value, depth, id) => {
    console.log("value:", value, "depth:", depth, "node.id : ", id);
    if (depth === "ClassName") {
      try {
        // Pass the value to the backend
        const response = await axios.post(
          `${BASE_URL}/api/treeitem-click/${value}/${depth}/${id}`
        );
        setimageView(response.data.image_urls);
        setTotalPages(Math.ceil(response.data.image_urls.length / pageSize));
        console.log("setimageView 다음 value:", value);
      } catch (error) {
        console.error("TreeItem click failed:", error);
      }
    }
    console.log("클릭하면 이게 나오나? value", value);
  };
  const handlePreviousPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const visibleItems = imageView.slice(startIndex, endIndex);

  const renderPageButtons = () => {
    const buttons = [];

    if (imageView.length > 0) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            onClick={() => setPage(i)}
            variant={page === i ? "contained" : "outlined"}
            sx={{
              minWidth: 0,
              width: 30,
              padding: 0,
              fontSize: 15,
            }}
          >
            {i}
          </Button>
        );
      }
    }
    return buttons;
  };

  const handleToggleClassName = (className) => {
    const isSelected = selectedClassNames.includes(className);
    let updatedSelectedClassNames = [];

    if (isSelected) {
      updatedSelectedClassNames = selectedClassNames.filter(
        (name) => name !== className
      );
    } else {
      updatedSelectedClassNames = [...selectedClassNames, className];
    }

    setSelectedClassNames(updatedSelectedClassNames);
    console.log("selectedClassNames 안 ", selectedClassNames);
  };

  const createNodeLabel = (node, nodeId) => (
    <Box display="flex" alignItems="center">
      <Checkbox onChange={() => handleToggleClassName(node.text)} />
      {editingNodeId === nodeId ? (
        <Box display="flex" alignItems="center">
          <TextField
            label="Edited Label"
            value={editingLabel}
            onChange={handleInputChange}
          />
          <Button
            onClick={() => {
              handleSaveNodeLabel(node.text, node.Depth, nodeId);
              console.log("node.Depth", node.Depth);
              console.log("nodeId", nodeId);
            }}
          >
            Save
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Box>
      ) : (
        <React.Fragment>
          <span>{node.text}</span>
          <Button onClick={() => handleEditNode(node.text, nodeId)}>
            Edit
          </Button>
        </React.Fragment>
      )}
    </Box>
  );
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", 
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
            style={{ fontFamily: "KIMM_Bold" }}
          >
            Erebor
          </Typography>
          <IconButton onClick={logout}>
            <LogoutIcon color="secondary" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <MainListItems />
          <Divider sx={{ my: 1 }} />
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 3000,
            }}
          >
          <Tag/>
            <Box display="flex" flexDirection="row">
              <Box width="50%" sx={{ p: 2 }}>
                <h1>Class List</h1>
                <Button variant="contained" onClick={handleShowSelectedValues}>
                  선택한 클래스 CSV 다운로드
                </Button>
                <TreeView
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                >
                  {Array.isArray(treeviewData) && createTreeItems(treeviewData)}
                </TreeView>
              </Box>
              
              <Divider orientation="vertical" variant="middle" flexItem />
              <Box width="50%" sx={{ p: 2 }}>
                {/*오른쪽 페이지 */}
                <h1>Image Display</h1>
                <Box display="flex" justifyContent="center">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    sx={{
                      display: imageView.length === 0 ? "none" : "inline-flex",
                    }}
                  >
                    이전
                  </Button>
                  {imageView.length > 0 && renderPageButtons()}
                  <Button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    sx={{
                      display: imageView.length === 0 ? "none" : "inline-flex",
                    }}
                  >
                    다음
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  {visibleItems &&
                    visibleItems.map((imagePath, index) => (
                      //<img key={index} src={imagePath} alt={`Image ${index}`} />
                      <Grid item xs={4} key={index}>
                        <Card
                          key={index}
                          variant="outlined"
                          sx={{
                            width: "100%",
                            height: "auto",
                            display: "flex",
                            flexDirection: "column",
                            my: 1,
                          }}
                        >
                          <CardActions>
                            {startIndex + index + 1}
                            <Typography>.</Typography>
                          </CardActions>
                          <CardMedia
                            component="img"
                            src={imagePath}
                            alt={`Image ${startIndex + index + 1}`}
                            height={200} // 원하는 이미지 높이로 설정합니다.
                          />
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Container>
        <Copyright sx={{ pt: 4 }} />
      </Box>
    </Box>
    // <div>
    //   <h1>Data Display</h1>
    //   <Button onClick={handleShowSelectedValues}>선택된 클래스 콘솔에 찍어보기 및 다운로드</Button>
    //   {renderTree(treeviewData)}
    // </div>
  );
};

export default DataDisplay;
