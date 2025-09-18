import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    header: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
    },
});

const PdfGeneration = ({ data }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>Invoice</Text>
                <View style={styles.row}>
                    <Text style={styles.text}>Invoice Number: {data.challan_number}</Text>
                    <Text style={styles.text}>Date: {data.load_date}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Agent: {data.agent_name}</Text>
                    <Text style={styles.text}>Total: {data.challan_amount}</Text>
                </View>
                {/* <View style={styles.section}>
                    <Text style={styles.header}>Items</Text>
                    {data.items.map((item, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.text}>{item.name}</Text>
                            <Text style={styles.text}>${item.price}</Text>
                        </View>
                    ))}
                </View> */}
            </View>
        </Page>
    </Document>

);

export default PdfGeneration;
