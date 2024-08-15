import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { serverLink } from "../../serverLink";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import documentImage from "../../images/docmentimage.jpg";
import fileDownload from "js-file-download";
import Cookies from "js-cookie";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FileUploader(props) {
  const [file, setFile] = useState(null);
  const [fileExists, setFileExists] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  useEffect(() => {
    setIsLoading(true);
    try {
      const jwtToken = getCookie("jwtToken");
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/initialise/getMasterFileUploadStatus`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          setFileExists(res.data.result);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          if (err.response && err.response.status === 401) {
            navigate("/");
          }
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, []);

  const handleFileSubmit = (e) => {
    const file = e.target.files[0];
    if (file.name.split(".").pop() !== "xlsx") {
      toast.error("Invalid file type, please upload an xlsx file", {
        position: "top-center",
        autoClose: true, // Do not auto-close
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          // Handle closing event
          console.log("Wrong file uploaded.");
        },
      });
      return;
    }
    setFile(file);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);
    // console.log("inside here");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/initialise/getFile`,
        formData,
        { withCredentials: true }
      );

      toast.success("File Upload success", {
        position: "top-center",
        autoClose: true, // Do not auto-close
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          // Handle closing event
          console.log("File Uploaded....");
          // Reload the window
          window.location.reload();
        },
      });
      // <Alert severity="success">File upload successful</Alert>;
      // <Alert severity="success" color="warning">
      //   This is a success Alert with warning colors.
      // </Alert>;
    } catch (error) {
      console.error("Upload error:", error);
      // console.log("the error, ", error.response);
      // console.log("the error, ", error.response.status);
      if (error.response && error.response.status === 401) {
        toast.error(
          "File upload failed. Please log in with correct credentials.",
          {
            position: "top-center",
            autoClose: true, // Do not auto-close
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: () => {
              // Handle closing event
              console.log("File Upload failed....");
              // Reload the window
            },
          }
        );
      } else {
        toast.error("File upload failed.", {
          position: "top-center",
          autoClose: true, // Do not auto-close
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => {
            // Handle closing event
            console.log("File Upload failed....");
            // Reload the window
          },
        });
      }
    }
  };

  const handleDownload = async () => {
    try {
      const token = getCookie("jwtToken"); // Get the JWT token from wherever it's stored (cookies, local storage, etc.)
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/initialise/uploadedFile`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      // console.log(response);
      fileDownload(response.data, "uploadedFile.xlsx");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col max-w-[800px] min-w-[80%] shadow-lg rounded-xl">
      <div className="flex justify-center items-center w-full h-11 bg-zinc-100 rounded-t-xl ">
        <p className="text-xl text-black">Upload The Master Excel File</p>
      </div>
      <div className="flex justify-center h-[fit-content]  rounded-b-xl items-center gap-2 p-1 box-border">
        {!fileExists && (
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            className="w-[fit-content] p-[2px]"
            onChange={handleFileSubmit}
          >
            <input type="file" accept=".xlsx" hidden />
            Choose File
          </Button>
        )}
        {!fileExists && file === null && (
          <p className="text-xl text-grey">No Files Uploaded</p>
        )}
        {!fileExists && file !== null && (
          <div className="flex justify-center items-center gap-7">
            <div className="flex  justify-center items-center shadow p-2 w-[300px] min-w-[200px] box-border h-15 ">
              <p className="text-lg text-black truncate w-[fit-content]">
                <b className="text-zinc-500">File Name : </b> {file.name}
              </p>
            </div>
            <div className="flex  justify-center items-center shadow p-2 w-[300px] box-border min-w-[200px] h-15">
              <div className="text-lg text-black truncate w-[fit-content]">
                <b className="text-zinc-500">Type : </b>
                {file.type}
              </div>
            </div>
          </div>
        )}
        {fileExists && (
          <div className="flex items-center flex-col h-[180px] gap-1">
            <img
              src={documentImage}
              alt="Not Found"
              style={{ width: "200px", height: "120px" }}
            />
            <p className="text-xl text-grey ">
              Hmm looks like you have already uploaded the file
            </p>
          </div>
        )}
      </div>
      {!fileExists && file != null && (
        <Button
          variant="contained"
          startIcon={<FileUploadIcon />}
          style={{ margin: "auto", marginBottom: "5px" }}
          onClick={uploadFile}
        >
          Upload
        </Button>
      )}
      {fileExists && (
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          style={{ margin: "auto", marginBottom: "5px" }}
          onClick={handleDownload}
        >
          Download the Uploaded File
        </Button>
      )}
    </div>
  );
}

export default FileUploader;
