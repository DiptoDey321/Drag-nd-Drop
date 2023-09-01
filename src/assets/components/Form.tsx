import { useState } from "react";
import { Input, Select, Button, Upload, Row, Col, message } from "antd";
import { CloudUploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Form as AntForm } from "antd";

interface OptionType {
  value: string | number;
  label: string;
}

interface UploadField {
  fieldName: string;
  file: File | null;
}

const initialUploadFields: UploadField[] = [{ fieldName: "", file: null }];
const initialFileNames: string[] = Array(initialUploadFields.length).fill("");

const Form = () => {
  const [form] = AntForm.useForm();
  const { Option } = Select;
  const [uploadFields, setUploadFields] =
    useState<UploadField[]>(initialUploadFields);
  const [fileNames, setFileNames] = useState<string[]>(initialFileNames);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const options: OptionType[] = [
    { value: "CSE", label: "CSE" },
    { value: "EEE", label: "EEE" },
    { value: "ICT", label: "ICT" },
  ];

  const handleFieldNameChange = (index: any, e: any) => {
    const { value } = e.target;
    const updatedFields = [...uploadFields];
    updatedFields[index].fieldName = value;
    setUploadFields(updatedFields);

    // Set the corresponding file name in the fileNames state
    const updatedFileNames = [...fileNames];
    updatedFileNames[index] = value;
    setFileNames(updatedFileNames);
  };

  const handleFormSubmit = async (values: any) => {
    let error = true;

    uploadFields.forEach((item) => {
      if (item.fieldName === "" && item.file === null) {
        message.error("Both fieldName and file are empty");
        error = false;
        return;
      } else if (item.fieldName === "") {
        message.error("Please Enter a file Name");
        error = false;
        return;
      } else if (item.file === null) {
        message.error("file is Empty.");
        error = false;
        return;
      }
    });

    if (!error) {
      return;
    }

    console.log(error);
    const formData = new FormData();
    formData.append("lossName", values.lossName);
    // formData.append("Dept Name", selectedLabel);

    for (let index = 0; index < uploadFields.length; index++) {
      const field = uploadFields[index];
      const file = field?.file;
      if (file) {
        const fileName = field.fieldName || ""; // Use the input field value directly
        const originalFileName = file?.name;
        const newFileName = `${fileName}_zzooz_${originalFileName}`;
        const modifiedFile = new File([file], newFileName, {
          type: file?.type,
        });
        formData.append(`files`, modifiedFile);
      }
    }
  };

  const handleDragStart = (index: any) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event: any, index: any) => {
    if (draggedIndex === null) return;
    setHoverIndex(index);
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleRemove = (index: any, event: any) => {
    event.stopPropagation(); // Add this line to prevent form submission
    const updatedFields = [...uploadFields];
    updatedFields.splice(index, 1);
    setUploadFields(updatedFields);
  };

  const handlePreview = (file: any) => {
    if (file.url) {
      window.open(file.url, "_blank");
    }
  };

  const handleAddField = () => {
    setUploadFields([...uploadFields, { fieldName: "", file: null }]);
  };

  const handleFileUploadChange = (index: any, info: any) => {
    const { fileList } = info;
    const file = fileList.length > 0 ? fileList[0].originFileObj : null;
    const updatedFields = [...uploadFields];
    updatedFields[index].file = file;
    setUploadFields(updatedFields);
  };

  return (
    <div style={{ width: "840px" }}>
      <AntForm
        form={form}
        onFinish={handleFormSubmit}
        className="llt-modal p-4"
      >
        <Row gutter={12}>
          <Col span={12}>
            <AntForm.Item
              name="lossName"
              label="Category Name"
              rules={[{ required: true, message: "Please enter the name" }]}
            >
              <Input placeholder="Enter the Name" />
            </AntForm.Item>
          </Col>

          <Col span={12}>
            <AntForm.Item
              name="tecnology"
              label="Department"
              rules={[
                { required: true, message: "Please select a technology" },
              ]}
            >
              <Select placeholder="Select a Dept" style={{ width: "100%" }}>
                {options?.map((option) => (
                  <Option
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  >
                    {option.label}
                  </Option>
                ))}
              </Select>
            </AntForm.Item>
          </Col>
        </Row>

        <AntForm.Item label="Upload Files " className="mt-2">
          <div className="file-upload">
            {uploadFields.map((field, index) => (
              // file upload container
              <div
                key={index}
                className="lose-link"
                style={{
                  maxWidth: "150px",
                  opacity: draggedIndex === index ? 0.5 : 1,
                }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(event) => handleDragOver(event, index)}
                onDragEnd={() => {
                  if (draggedIndex !== null && hoverIndex !== null) {
                    const updatedFields = [...uploadFields];
                    const draggedField = updatedFields.splice(
                      draggedIndex,
                      1
                    )[0];
                    updatedFields.splice(hoverIndex, 0, draggedField);
                    setUploadFields(updatedFields);
                  }
                  setDraggedIndex(null);
                  setHoverIndex(null);
                }}
              >
                <div
                  style={{
                    minHeight: "115px",
                    marginBottom: "15px",
                    marginLeft: "10px",
                  }}
                  className="uploading-container"
                >
                  <Input
                    style={{ marginBottom: "10px" }}
                    placeholder="File Name"
                    value={field.fieldName}
                    onChange={(e) => handleFieldNameChange(index, e)}
                  />
                  <Upload
                    // fileList={field.file ? [field.file] : []}
                    beforeUpload={() => false}
                    onChange={(info) => handleFileUploadChange(index, info)}
                    onRemove={(event) => handleRemove(index, event)}
                    onPreview={handlePreview}
                  >
                    <Button
                      style={{ width: "106px" }}
                      icon={<CloudUploadOutlined />}
                    >
                      Select File
                    </Button>
                  </Upload>
                  {index > 0 && (
                    <span
                      className="remove-button  llt-cross-btn"
                      onClick={(e) => handleRemove(index, e)}
                    >
                      {" "}
                      X{" "}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div
              className="lose-link"
              style={{ maxWidth: "150px", marginLeft: "10px" }}
            >
              <div
                className="add-file-btn d-flex flex-column align-items-center justify-content-center border rounded me-2 p-2"
                onClick={handleAddField}
                style={{ cursor: "pointer" }}
              >
                <PlusOutlined />
                <p>Add File</p>
              </div>
            </div>
          </div>
        </AntForm.Item>

        <AntForm.Item className="submit-btn">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </AntForm.Item>
      </AntForm>
    </div>
  );
};

export default Form;
