import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    RefreshControl,
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';
import { Provider as PaperProvider, Snackbar, ActivityIndicator, Dialog, Colors, Modal, Paragraph, Divider, Card, DataTable, Appbar, List, Avatar, Text, TextInput, Title, Subheading, Caption, Searchbar, Button, IconButton, Portal } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import MultiSelect from 'react-native-multiple-select';
import DatePicker from 'react-native-datepicker'

const moment = require('moment');
const axios = require('axios');
import { apihost } from '../apihost';

console.disableYellowBox = true;

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#171a21',
    },
    header: {
        width: '100%',
        backgroundColor: '#2a475e',
    },
    Searchbar: {
        marginLeft: '10%',
        marginRight: '10%',
        borderRadius: 20,
    },
    ListTitle: {
        fontWeight: 'bold',
    },
    TouchableOpacityStyle: {
        position: 'absolute',
        width: '12%',
        height: '7%',
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    FloatingButtonStyle: {
        resizeMode: 'contain',
        width: '150%',
        height: '150%',
        //backgroundColor:'black'
    },
    appbarcontent: {
        textAlign: 'center',
        color: '#c7d5e0',
        fontSize: 25
    },
    divider: {
        marginBottom: '20%',
        backgroundColor: 'transparent'
    },
});

const textInput = {
    colors: { primary: '#66c0f4', underlineColor: 'transparent' }
}

const Phonebook = () => {
    const [visible, setVisible] = useState(false);
    const [modal, setModal] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);
    const [id, setId] = useState(-1);
    const [contactNumber, setContactNumber] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState(moment().format('MM-DD-YYYY'));
    const [address, setAddress] = useState("");
    const [image, setImage] = useState(null);
    const [selectedContact, setSelectedContact] = useState([]);
    const [animating, setAnimating] = useState(false);
    const [snackbarTxt, setSnackbarTxt] = useState("");
    const [snackbarColor, setSnackbarColor] = useState("");
    const [snackbar, setSnackbar] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [infoModal, setInfoModal] = useState(false);
    const [error, setError] = useState(false);
    const [errNameMsg, setErrNameMsg] = useState("");
    const [errEmailMsg, setErrEmailMsg] = useState("");
    const [errBirthDateMsg, setErrBirthDateMsg] = useState("");
    const [errContactMsg, setErrContactMsg] = useState("");
    const [errAddressMsg, setErrAddressMsg] = useState("");
    const [errImageMsg, setErrImageMsg] = useState("");
    const [errStatus, setErrStatus] = useState("");
    const [addEditTitle, setAddEditTitle] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [delSuccess, setDelSuccess] = useState(false);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        var route = selectedContact.length > 0 ? `api/phonebook/${selectedContact}/` : 'api/phonebook/';
        var url = apihost + route;

        axios.get(url)
            .then(function (response) {
                // handle success            
                if (Array.isArray(response.data)) {
                    setFetchedData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setFetchedData(obj);
                }
                // console.log(fetchedData);
                setTimeout(() => setLoading(false), 3000)
            })
            .catch(function (error) {
                // handle error
                setTimeout(() => setLoading(false), 3000)
            })
            .finally(function () {
                // always executed
            });
    }, [fetchedData]);


    var contactList = fetchedData ? fetchedData.map(x => ({
        id: x.id,
        Name: x.Name,
        ContactNumber: x.ContactNumber,
        Email: x.Email,
        BirthDate: x.BirthDate,
        Address: x.Address,
        Image: x.Image
    })) : [];

    const onSave = (method) => {
        var route = method !== 'put' ? 'api/phonebook/' : `api/phonebook/${id}/`;
        var url = apihost + route;
        const data = new FormData();
        data.append('id', id);
        data.append('Name', name);
        data.append('ContactNumber', contactNumber);
        data.append('Email', email);
        data.append('BirthDate', birthDate);
        data.append('Address', address);
        if (image !== null)
            data.append('Image', image, image.name);

        if (method === 'post') {
            axios
                .post(url, data)
                .then(res => {
                    setModal(false);
                    setId(-1);
                    setName("");
                    setContactNumber("");
                    setEmail("");
                    setBirthDate(moment().format('MM-DD-YYYY'));
                    setAddress("");
                    setImage(null);
                    setError(false);
                    setErrNameMsg("");
                    setErrContactMsg("");
                    setErrEmailMsg("");
                    setErrBirthDateMsg("");
                    setErrAddressMsg("");
                    setErrImageMsg("");
                    setSnackbar(true);
                    setSnackbarTxt("Successfully Add.");
                    setSnackbarColor('green');
                    setPreview("");
                })
                .catch(err => {
                    const errors = {
                        msg: err.response.data,
                        status: err.response.status
                    }
                    setError(true);
                    setErrStatus(errors.status);
                    console.log(err.response.data)
                    if (errors.msg.Name) setErrNameMsg(`Name: ${errors.msg.Name.join()}`);
                    if (errors.msg.Email) setErrEmailMsg(`Email: ${errors.msg.Email.join()}`);
                    if (errors.msg.ContactNumber) setErrContactMsg(`Contact: ${errors.msg.ContactNumber.join()}`);
                    if (errors.msg.BirthDate) setErrBirthDateMsg(`Birthday: ${errors.msg.BirthDate.join()}`);
                    if (errors.msg.Address) setErrAddressMsg(`Address: ${errors.msg.Address.join()}`);
                    if (errors.msg.Image) setErrImageMsg(`Image: ${errors.msg.Image.join()}`);
                })
        } else {
            axios
                .put(url, data)
                .then(res => {
                    setModal(false);
                    setId(-1);
                    setName("");
                    setContactNumber("");
                    setEmail("");
                    setBirthDate(moment().format('MM-DD-YYYY'));
                    setAddress("");
                    setImage(null);
                    setError(false);
                    setErrNameMsg("");
                    setErrContactMsg("");
                    setErrEmailMsg("");
                    setErrBirthDateMsg("");
                    setErrAddressMsg("");
                    setErrImageMsg("");
                    setSnackbar(true);
                    setSnackbarTxt("Successfully Edited.");
                    setSnackbarColor('green');
                    setPreview("")
                })
                .catch(err => {
                    const errors = {
                        msg: err.response.data,
                        status: err.response.status
                    }
                    console.log(err.response.data);
                    setError(true);
                    setErrStatus(errors.status);
                    if (errors.msg.Name) setErrNameMsg(`Name: ${errors.msg.Name.join()}`);
                    if (errors.msg.Email) setErrEmailMsg(`Email: ${errors.msg.Email.join()}`);
                    if (errors.msg.ContactNumber) setErrContactMsg(`Contact: ${errors.msg.ContactNumber.join()}`);
                    if (errors.msg.BirthDate) setErrBirthDateMsg(`Birthday: ${errors.msg.BirthDate.join()}`);
                    if (errors.msg.Address) setErrAddressMsg(`Address: ${errors.msg.Address.join()}`);
                    if (errors.msg.Image) setErrImageMsg(`Image: ${errors.msg.Image.join()}`);
                })
        }
    }

    const _openMenu = (selectedItem) => {
        setVisible(true);
        setSelectedContact(selectedItem);
    }

    const _closeMenu = () => { setVisible(false); }

    const _showModal = (title) => {
        setAddEditTitle(title);
        setModal(true);
        setVisible(false);
    }
    const _showEditModal = (param) => {
        setAddEditTitle("Edit");
        setModal(true);
        setId(param.id);
        setName(param.Name);
        setContactNumber(param.ContactNumber);
        setEmail(param.Email);
        setAddress(param.Address);
        setBirthDate(param.BirthDate);
        setImage(null);
        setVisible(false);
    }

    const _hideModal = () => {
        setModal(false);
        setId(-1);
        setName("");
        setContactNumber("");
        setEmail("");
        setAddress("");
        setBirthDate(moment().format('MM-DD-YYYY'));
        setImage(null);
        setPreview("");
    }

    const _closeSnackbar = () => { setSnackbar(false); }

    const _indicator = () => { console.log('indicator'); }

    const choosePhoto = () => {
        var options = {
            title: 'Select Image',
            customButtons: [
                { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, response => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                let source = 'data:image/jpeg;base64,' + [response.data];
                const previewSource = { uri: response.uri };
                setPreview(previewSource);

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                // const imageData = new FormData();
                // //imageData.append('name', 'image');
                // imageData.append("File", {
                //     uri: response.uri,
                //     name: response.fileName,
                //     size: response.fileSize,
                //     type: response.type,
                //     data: response.data
                // });
                var imageData = {
                    uri: response.uri,
                    name: response.fileName,
                    size: response.fileSize,
                    type: response.type,
                    data: response.data
                }
                setImage(imageData);
            }
        });
    };

    const openDelModal = (id) => {
        setDeleteModal(true);
        setId(id);
    }

    const cancelDelModal = () => {
        setDeleteModal(false);
        setId(-1);
        setName("");
        setContactNumber("");
        setEmail("");
        setBirthDate(moment().format('MM-DD-YYYY'));
        setAddress("");
        setImage(null);
    }

    const errorWarning = () => {
        setError(false);
        setErrNameMsg("");
        setErrContactMsg("");
        setErrEmailMsg("");
        setErrBirthDateMsg("");
        setErrAddressMsg("");
        setErrImageMsg("");
    }

    const onDelete = () => {
        var url = apihost + `api/phonebook/${id}/`;
        axios
            .delete(url)
            .then(res => {
                setModal(false);
                setDeleteModal(false);
                setDelSuccess(true);
                setId(-1);
                setName("");
                setContactNumber("");
                setEmail("");
                setBirthDate("");
                setImage(null);
                setSnackbar(true);
                setSnackbarTxt("Successfully Deleted.");
                setSnackbarColor('green');
            })
            .catch(err => console.log(err.response.data + id))
    }

    function ContactOption(item) {
        var list = [];

        if (item !== undefined || item !== null) {
            item.map(x => {
                var name = x.Name;

                return (
                    list.push({
                        id: x.id,
                        name: name
                    }))
            })
        }
        return list;
    }

    return (
        <View style={styles.MainContainer}>
            <Portal>
                <Modal
                    visible={loading}
                    theme={{ colors: { backdrop: 'rgba(255, 255, 255, 0.3)' }, marginTop: 10 }}
                >
                    <Card style={{ height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#171a21' }}>

                        <Image
                            source={require('../assets/loadingscreen.png')}
                            style={{ width: 400, height: 400, alignSelf: 'center', marginTop: '40%' }}
                        />

                    </Card>
                </Modal>
            </Portal>
            <Appbar.Header style={styles.header}>
                <Appbar.Content title="Contact" />
                <Appbar.Action icon='information' onPress={() => setInfoModal(true)} />
            </Appbar.Header>
            <Divider style={{ marginBottom: '2%', backgroundColor: 'transparent' }} />

            <MultiSelect
                single
                hideTags
                hideSubmitButton
                hideDropdown
                iconSearch
                items={ContactOption(contactList)}
                uniqueKey="id"
                // ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={e => setSelectedContact(e)}
                selectedItems={selectedContact}
                selectText="  Search..."
                // searchInputPlaceholderText="Search Items..."
                onChangeInput={() => setSelectedContact([])}
                altFontFamily="ProximaNova-Light"
                tagRemoveIconColor="#1b2838"
                tagBorderColor="#1b2838"
                selectedItemTextColor="#1b2838"
                selectedItemIconColor="#fff"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#1b2838' }}
            />

            <ScrollView>
                <StatusBar backgroundColor="#1b2838" barStyle="dark-content" />
                <View>
                    <FlatList
                        data={contactList}
                        renderItem={({ item }) =>
                            <List.Item key={item.id} id={item.id}
                                onPress={() => _showEditModal(item)} onLongPress={() => openDelModal(item.id)}
                                style={{ display: 'flex', width: '100%', maxHeight: 85 }}
                                titleStyle={styles.ListTitle}
                                title={<Text style={{ color: '#fff', fontSize: 20 }}>{item.Name}</Text>}
                                description={() =>
                                    <Caption style={{ color: '#fff', fontSize: 10 }}>{item.ContactNumber}</Caption>
                                }
                                left={props => <Image style={{ width: 65, height: 65, marginTop: '2%', borderRadius: 50 }} source={{ uri: item.Image }} />}
                            // right={props => <IconButton size={35} style={{ marginTop: '4%' }} icon='more-vert' onPress={() => _openMenu(x)} />}
                            />
                        }
                    />
                </View>
                <Divider style={styles.divider} />

                {contactList === null || contactList.length === 0 &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/no-result-found.png')} />
                    </View>
                }

                <Portal>
                    <Modal visible={infoModal} onDismiss={() => setInfoModal(false)}>
                        <Card style={{ height: '100%', width: '100%', backgroundColor: '#1b2838' }}>
                            <Appbar.Header style={styles.header}>
                                <Appbar.BackAction onPress={() => setInfoModal(false)} />
                                <Appbar.Content title="Info" style={{ textAlign: 'center' }} />
                            </Appbar.Header>
                            <Card.Content>
                                <Divider style={{ marginBottom: '2%' }} />
                                <Text style={{ color: '#c7d5e0', fontSize: 18 }}>This app was build using <Text style={{ fontWeight: "bold", color: '#66c0f4' }}>React-Native</Text> + <Text style={{ fontWeight: "bold", color: '#66c0f4' }}>React Native Paper.</Text></Text>
                                <Divider style={{ marginBottom: '2%' }} />
                                <Divider style={{ marginBottom: '2%' }} />

                                <Text style={{ color: '#c7d5e0', fontSize: 18 }}>FAQ</Text>
                                <List.AccordionGroup>
                                    <List.Accordion title={<Text style={{ fontSize: 18, color: '#c7d5e0' }}>How to add?</Text>} id="1">
                                        <List.Item title={
                                            <Text style={{ color: '#c7d5e0', fontSize: 15 }}>Press the floating button at the bottom right.</Text>
                                        } />
                                    </List.Accordion>
                                    <List.Accordion title={<Text style={{ fontSize: 18, color: '#c7d5e0' }}>How to edit?</Text>} id="1">
                                        <List.Item title={
                                            <Text style={{ color: '#c7d5e0', fontSize: 15 }}>Just press the desired contact to edit.</Text>
                                        } />
                                    </List.Accordion>
                                    <List.Accordion style={{ color: 'white' }} title={<Text style={{ fontSize: 18, color: '#c7d5e0' }}>How to delete?</Text>} id="2">
                                        <List.Item title={
                                            <Text style={{ color: '#c7d5e0', fontSize: 15 }}>Long hold the contact to delete it.</Text>
                                        } />
                                    </List.Accordion>
                                    <List.Accordion style={{ color: 'white' }} title={<Text style={{ fontSize: 18, color: '#c7d5e0' }}>Is it offline?</Text>} id="2">
                                        <List.Item title={
                                            <Text style={{ color: '#c7d5e0', fontSize: 15 }}>No, this app was connected to online server.</Text>
                                        } />
                                    </List.Accordion>
                                </List.AccordionGroup>

                                <Divider style={{ marginBottom: '2%' }} />
                                <Divider style={{ marginBottom: '2%' }} />
                                <Text style={{ color: '#c7d5e0', fontSize: 18 }}>This is a personal project only. You can't actually use it because everyone who has this app will upload, delete, edit in one database. I didn't create the user accounts because I'm only practicing CRUD.</Text>

                                <Divider style={{ marginBottom: '2%' }} />
                                <Divider style={{ marginBottom: '2%' }} />
                                <Text style={{ color: '#c7d5e0', fontSize: 18, textAlign: 'center' }}>Anyways thanks for downloading this app.</Text>
                            </Card.Content>
                        </Card>
                    </Modal>
                </Portal>

                <Portal>
                    <Modal visible={modal} onDismiss={_hideModal} style={{ height: '100%' }}>
                        <Card style={{ height: '100%', width: '100%', backgroundColor: '#1b2838' }}>
                            <Appbar.Header style={styles.header}>
                                <Appbar.BackAction onPress={_hideModal} />
                                <Appbar.Content title={addEditTitle} style={{ textAlign: 'center' }} />
                                <Button mode='contained' color='#171a21' onPress={_hideModal} dark style={{ marginRight: '5%' }}>Cancel</Button>
                                {id === -1 ?
                                    <Button mode='contained' icon='content-save' color='#171a21' style={{ marginRight: '5%' }} loading={btnLoading} dark onPress={() => onSave('post')}>Save</Button> :
                                    <Button mode='contained' icon='content-save' color='#171a21' style={{ marginRight: '5%' }} loading={btnLoading} dark onPress={() => onSave('put')}>Save</Button>
                                }
                            </Appbar.Header>
                            <Card.Content style={{ height: '500%' }}>
                                <ScrollView style={{ height: '500%' }}>
                                    <Divider style={{ marginBottom: '2%' }} />
                                    {preview !== "" && <Image source={preview} style={{ width: 70, height: 70, alignSelf: 'center' }} />}
                                    <Divider style={{ marginBottom: '2%' }} />
                                    <Button mode='contained' color='#c7d5e0' onPress={(evt) => choosePhoto(evt)}>Choose Photo</Button>
                                    <Divider style={{ marginBottom: '2%' }} />
                                    <Text style={{ color: '#c7d5e0', fontSize: 18 }}>Name</Text>
                                    <TextInput error={errNameMsg !== "" ? true : false} mode='outlined' theme={textInput} placeholder='Name' value={name} onChangeText={e => setName(e)} />
                                    <Divider style={{ marginBottom: '2%' }} />
                                    <Text style={{ color: '#c7d5e0', fontSize: 18 }}>Contact</Text>
                                    <TextInput error={errContactMsg !== "" ? true : false} keyboardType='numeric' theme={textInput} mode='outlined' placeholder='Contact' value={contactNumber} onChangeText={e => setContactNumber(e)} />
                                    <Divider style={{ marginBottom: '2%' }} />
                                    <Text style={{ color: '#c7d5e0', fontSize: 18 }}>Email</Text>
                                    <TextInput error={errEmailMsg !== "" ? true : false} mode='outlined' theme={textInput} placeholder='Email' value={email} onChangeText={e => setEmail(e)} />
                                    <Divider style={{ marginBottom: '2%' }} />
                                    <Text style={{ color: '#c7d5e0', fontSize: 18 }}>Birthday</Text>
                                    <Divider style={{ marginBottom: '2%' }} />
                                    <DatePicker
                                        style={{ width: '100%', backgroundColor: '#fff' }}
                                        date={birthDate}
                                        mode="date"
                                        placeholder="select date"
                                        format="YYYY-MM-DD"
                                        minDate="2016-05-01"
                                        maxDate="2016-06-01"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0
                                            },
                                            dateInput: {
                                                marginLeft: 36
                                            }
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => setBirthDate(date)}
                                    />
                                    <Divider style={{ marginBottom: '2%' }} />
                                    <Text style={{ color: '#c7d5e0', fontSize: 18 }}>Address</Text>
                                    <TextInput mode='outlined' theme={textInput} placeholder='Address' value={address} onChangeText={e => setAddress(e)} />
                                    <Divider style={{ marginBottom: '2%' }} />
                                </ScrollView>
                            </Card.Content>
                        </Card>
                    </Modal>
                </Portal>

                <Portal>
                    <Dialog visible={deleteModal} onDismiss={cancelDelModal} style={{ backgroundColor: '#1b2838' }}>
                        <Dialog.Title style={{ color: 'red' }}>Warning</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph style={{ color: '#c7d5e0' }}>Are you sure you want to delete this Contact?</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode='contained' dark color='#2a475e' style={{ marginRight: '3%' }} onPress={cancelDelModal}>Cancel</Button>
                            <Button mode='contained' dark color='#2a475e' style={{ marginRight: '5%' }} onPress={onDelete}>Delete</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

                <Portal>
                    <Dialog visible={error} onDismiss={errorWarning} style={{ backgroundColor: '#1b2838' }}>
                        <Dialog.Title style={{ color: 'red' }}>Error</Dialog.Title>
                        <Dialog.Content>
                            {errImageMsg !== "" && <Paragraph style={{ color: '#c7d5e0' }}>{errImageMsg}</Paragraph>}
                            {errNameMsg !== "" && <Paragraph style={{ color: '#c7d5e0' }}>{errNameMsg}</Paragraph>}
                            {errContactMsg !== "" && <Paragraph style={{ color: '#c7d5e0' }}>{errContactMsg}</Paragraph>}
                            {errEmailMsg !== "" && <Paragraph style={{ color: '#c7d5e0' }}>{errEmailMsg}</Paragraph>}
                            {errBirthDateMsg !== "" && <Paragraph style={{ color: '#c7d5e0' }}>{errBirthDateMsg}</Paragraph>}
                            {errAddressMsg !== "" && <Paragraph style={{ color: '#c7d5e0' }}>{errAddressMsg}</Paragraph>}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode='contained' dark color='#2a475e' style={{ marginRight: '5%' }} onPress={errorWarning}>Okay</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ScrollView>

            <Snackbar
                visible={snackbar}
                onDismiss={_closeSnackbar}
                /* action={{
                    label: 'Ok',
                    onPress: () => { this._closeSnackbar },
                }} */
                style={{ backgroundColor: snackbarColor, zIndex: 100 }}
            >
                {snackbarTxt}
            </Snackbar>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => _showModal('Add')}
                style={styles.TouchableOpacityStyle}>
                <Image
                    source={require('../assets/add-user-add-pngrepo-com.png')}
                    style={styles.FloatingButtonStyle}
                />
            </TouchableOpacity>
        </View>
    );
}

export default Phonebook;