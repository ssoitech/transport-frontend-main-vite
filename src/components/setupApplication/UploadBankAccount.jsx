import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/AxiosConfig';

const UploadBankAccount = () => {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [excelData, setExcelData] = useState([]);
    const [validExceldata, setValidExceldata] = useState([]);
    const [duplicateRecords, setDuplicateRecords] = useState(0);
    const [invalidRecords, setInvalidRecords] = useState([]);
    const [formData, setFormData] = useState({
        ownerName: '',
        pan: '',
        contactNumber: '',
        bankAccountNumber: '',
        ifsc: '',
        bankName: '',
        branchName: '',
        address: ''
    });

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const bankAccountNumberRegex = /^[0-9]{9,18}$/; // Allows only digits, 9 to 18 in length

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
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Extract raw data as an array

            // Define the desired keys
            const keys = ['slNo', 'ownerName', 'pAN', 'contactNumber', 'bankAccountNumber', 'iFSC', 'bankName', 'branchName', 'address'];

            // Transform data: Ignore the first row (column names) and map rows to keys
            const formattedData = jsonData.slice(1).map(row => {
                return keys.reduce((obj, key, index) => {
                    obj[key] = row[index] || ''; // Assign values based on index, handle missing values
                    return obj;
                }, {});
            });

            setExcelData(formattedData);

            // Count occurrences of each PAN
            const accountNumberCount = formattedData.reduce((acc, item) => {
                acc[item.bankAccountNumber] = (acc[item.bankAccountNumber] || 0) + 1;
                return acc;
            }, {});

            // Find duplicate PAN records count
            const duplicateAccountNumberCount = Object.values(accountNumberCount).filter(count => count > 1).length;
            setDuplicateRecords(duplicateAccountNumberCount);

            // Separate valid records
            let validRecords = formattedData.filter(item => {
                const isPanValid = panRegex.test(item.pAN);
                const isAccountNumberValid = bankAccountNumberRegex.test(item.bankAccountNumber);
                return isPanValid && isAccountNumberValid;
            });

            // Filter invalid records (opposite condition)
            const invalidRecords = formattedData.filter(item => {
                const isPanValid = panRegex.test(item.pAN);
                const isAccountNumberValid = bankAccountNumberRegex.test(item.bankAccountNumber);
                return !isPanValid || !isAccountNumberValid; // Store records that fail validation
            });
            setInvalidRecords(invalidRecords);

            // Remove duplicates based on PAN
            const uniqueAccountNumberSet = new Set();
            validRecords = validRecords.filter(item => {
                if (uniqueAccountNumberSet.has(item.bankAccountNumber)) {
                    return false; // Skip duplicate PAN
                } else {
                    uniqueAccountNumberSet.add(item.bankAccountNumber);
                    return true; // Keep unique PAN
                }
            });

            setValidExceldata(validRecords);

        };
        reader.readAsArrayBuffer(file);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleSaveToDatabase = async () => {
        setLoading(true);

        const requestData = {
            createdBy: accessDetails.userId,
            createdTime: new Date().toISOString(),
            bankDetails: validExceldata,
        };
        // Replace with your API call
        console.log('Saving to database:', requestData);


        await axiosInstance.post("/api/v1/challan-holder/excel-upload/save-banks", requestData)
            .then((response) => {
                setLoading(false);

                if (response.data.status === 'success') {
                    Swal.fire("Success", "Owner And Bank Details Uploaded Successfully!!", "success");
                    downloadInvalidRecords();
                }
                if (response.data.status === 'error') {
                    Swal.fire("Error", "An error occurred while processing Records", "error");
                }
            })
            .catch((error) => {
                setLoading(false);
                Swal.fire("Error", "Some Error Occured!!", "error");
                console.error("Error:", error);
            });
    };

    const handleNew = () => {
        window.location.reload();
    }

    const handleDownload = (event) => {
        event.preventDefault(); // Prevent default behavior (important)

        const fileUrl = "/excel_templates/upload_bank_account_template.xlsx"; // Path inside the public folder
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "Upload_Bank_Account_Template.xlsx"); // Set the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to download invalid records as Excel
    const downloadInvalidRecords = () => {
        if (invalidRecords.length === 0) {
            // alert("No invalid records to download!");
            return;
        }

        // Convert JSON to worksheet
        const worksheet = XLSX.utils.json_to_sheet(invalidRecords);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Invalid Records");

        // Download Excel file
        XLSX.writeFile(workbook, "Invalid_Bank_Account_Records.xlsx");
    };

    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center mt-auto p-1" role="alert">
                <span className='mb-0 text-black h6'>Vehicle Owner/ Challan Holder Bank Details Upload (Multiple A/C)</span>
            </div>
            <Container>
                <Row className="my-3">
                    <Col>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload Excel File</Form.Label>
                            <Form.Control type="file" onChange={handleFileUpload} />
                        </Form.Group>
                        {/* <Button variant="primary" onClick={handleFileUpload}>Extract</Button> */}
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col>
                        <Form>
                            <Row>
                                <Col> <button className="btn btn-sm btn-primary" onClick={handleDownload}>
                                    Get Template
                                </button></Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Duplicate Records</Form.Label>
                                        <Form.Control type="text" name="contactNumber" value={duplicateRecords} />
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group>
                                        <Form.Label>Total Valid Records</Form.Label>
                                        <Form.Control type="text" name="contactNumber" value={validExceldata.length} />
                                    </Form.Group>
                                </Col>
                                {/* <Col><Form.Control type="text" placeholder="" name="bankAccountNumber" /></Col> */}
                                <Col><button className="btn btn-sm btn-secondary" onClick={handleNew}>New</button></Col>
                                <Col>

                                    <button type="submit" className="btn btn-sm btn-success w-100" disabled={loading} onClick={handleSaveToDatabase}>
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

                        </Form>
                    </Col>
                </Row>
                <Row className="my-4">
                    <Col className='table-responsive'>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className='bg-warning'>SL No</th>
                                    <th className='bg-warning'>Owner Name</th>
                                    <th className='bg-warning'>PAN</th>
                                    <th className='bg-warning'>Contact Number</th>
                                    <th className='bg-warning'>Bank Account Number</th>
                                    <th className='bg-warning'>IFSC</th>
                                    <th className='bg-warning'>Bank Name</th>
                                    <th className='bg-warning'>Branch Name</th>
                                    <th className='bg-warning'>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {excelData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.slNo}</td>
                                        <td>{row.ownerName}</td>
                                        <td>{row.pAN}</td>
                                        <td>{row.contactNumber}</td>
                                        <td>{row.bankAccountNumber}</td>
                                        <td>{row.iFSC}</td>
                                        <td>{row.bankName}</td>
                                        <td>{row.branchName}</td>
                                        <td>{row.address}</td>
                                    </tr>
                                ))} */}

                                {excelData.map((item, index) => {
                                    const isPanValid = panRegex.test(item.pAN);
                                    const isBankAccountNumberValid = bankAccountNumberRegex.test(item.bankAccountNumber);

                                    return (
                                        <tr key={index}>
                                            <td>{item.slNo}</td>
                                            <td>{item.ownerName}</td>
                                            <td style={{ backgroundColor: isPanValid ? "white" : "red" }}>{item.pAN}</td>
                                            <td>{item.contactNumber || "N/A"}</td>
                                            <td style={{ backgroundColor: isBankAccountNumberValid ? "white" : "red" }}>{item.bankAccountNumber}</td>
                                            <td>{item.iFSC}</td>
                                            <td>{item.bankName}</td>
                                            <td>{item.branchName}</td>
                                            <td>{item.address}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default UploadBankAccount;
