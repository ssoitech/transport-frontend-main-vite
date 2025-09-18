import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import axiosInstance from '../../config/AxiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const VehicleNumberUpload = () => {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();
    const [excelData, setExcelData] = useState([]);
    const [panNotFoundData, setPanNotFoundData] = useState([]);
    const [duplicateVehicleNumber, setDuplicateVehicleNumber] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        pan: '',
        vehicleNumber: ''
    });

    useEffect(() => {
        if (accessDetails) {
            if (accessDetails.role !== 'ADMIN') {
                if (accessDetails.role === 'USER') {
                    if (accessDetails.setupApplicationAccess !== "Y") {
                        Swal.fire("Error", "You don't have access to this section.", "error");
                        navigate('/work-space');
                    }

                } else {
                    Swal.fire("Error", "You don't have access to this section.", "error");
                    navigate('/work-space');
                }
            }

        } else {
            Swal.fire("Error", "You don't have access to this section.", "error");
            navigate('/work-space');
        }

    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            console.log(jsonData)

            // Define the desired keys
            const keys = ['sLNo', 'pAN', 'vehicleNumber'];

            // Transform data: Ignore the first row (column names) and map rows to keys
            const formattedData = jsonData.slice(1).map(row => {
                return keys.reduce((obj, key, index) => {
                    obj[key] = row[index] || ''; // Assign values based on index, handle missing values
                    return obj;
                }, {});
            });
            setExcelData(formattedData);
            console.log(formattedData);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    function toCamelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }

    function convertKeysToCamelCase(obj) {
        if (Array.isArray(obj)) {
            return obj.map(v => convertKeysToCamelCase(v));
        } else if (obj !== null && obj.constructor === Object) {
            return Object.keys(obj).reduce((result, key) => {
                const camelCaseKey = toCamelCase(key);
                result[camelCaseKey] = convertKeysToCamelCase(obj[key]);
                return result;
            }, {});
        }
        return obj;
    }

    const handleSaveToDatabase = async () => {
        setLoading(true);
        // const camelCaseData = convertKeysToCamelCase(excelData);
        const data = {
            "createdBy": accessDetails.userId,
            "createdAt": new Date().toISOString(),  // Get current timestamp
            "truckList": excelData
        };

        await axiosInstance.post("/api/v1/save-trucks-from-excel", data)
            .then(response => {
                setLoading(false);

                if (response.data.status === 'success') {
                    setPanNotFoundData(response.data.panNotFoundList)
                    setDuplicateVehicleNumber(response.data.vehicleNumberAlreadyExistList)
                    Swal.fire("Success", "Successfully Processed..", "success");
                }
                if (response.data.status === 'error') {
                    Swal.fire("Error", "An error occurred while processing trucks", "error");
                }

            })
            .catch(error => {
                setLoading(false);
                console.error("Error:", error);
            });

    };

    const handleNew = () => {
        window.location.reload();
    }

    const handleDownload = (event) => {
        event.preventDefault(); // Prevent default behavior (important)

        const fileUrl = "/excel_templates/vehicle_number_upload_template.xlsx"; // Path inside the public folder
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "Vehicle_Number_Upload_Template.xlsx"); // Set the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center mt-auto p-1" role="alert">
                <span className='mb-0 text-black h6'>Vehicle Number Upload</span>
            </div>
            <Container>
                <Row className="my-3">
                    <Col>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload Excel File</Form.Label>
                            <Form.Control type="file" onChange={handleFileUpload} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col>
                        <button className="btn btn-primary mr-4" onClick={handleDownload}> Get Template</button>
                        <Button variant="secondary" onClick={handleNew}>New</Button>
                        {/* <Button variant="success" className="ml-3" onClick={handleSaveToDatabase}>Save to Database</Button> */}
                        <button type="button" className="btn btn-success ml-3" disabled={loading} onClick={handleSaveToDatabase}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Saving ...
                                </>
                            ) : (
                                'Save to Database'
                            )}
                        </button>
                    </Col>
                </Row>
                <Row className="my-3">

                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className='bg-warning text-center'>SL No</th>
                                    <th className='bg-warning text-center'>PAN</th>
                                    <th className='bg-warning text-center'>Vehicle Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.sLNo}</td>
                                        <td>{row.pAN}</td>
                                        <td>{row.vehicleNumber}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>SL.No</th>
                                    <th>PAN Not Exist</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Add your data here */}
                                {panNotFoundData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className='bg-danger text-white'>{row}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>SL.No</th>
                                    <th>Duplicate Truck Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Add your data here */}
                                {duplicateVehicleNumber.map((row, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className='bg-danger text-white'>{row}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default VehicleNumberUpload;
