import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import apiService from "../../../services/api.service";
import api_instance from "../../../utils/api";
import styles from "./AddItemModal.module.css";


class AddItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldArr: [],
      title: "",
      dropdownArr: [],
    };
  }

  componentDidMount() {
    if (this.props.typeModal === "newContact") {
      this.updateStateObj(this.props.typeModal, this.props.editData);
    } else {
      this.getDropdownData();
    }
  }

  getDropdownData() {
    let path = "";
    switch (this.props.typeModal) {
      case "transactions":
        path = `api/all_payment_account`;
        break;
      case "otherService":
        path = `api/get_all_other_service`;
        break;
      default:
    }
    api_instance
      .get(path)
      .then((response) => {
        if (response.status === 200 && response.data) {
          this.setState({
            dropdownArr: response.data,
          });
          this.updateStateObj(this.props.typeModal);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateStateObj(typeModal, editData) {
    let title = "";
    let fieldArr = "";

    switch (typeModal) {
      case "transactions":
        const accountId = this.state.dropdownArr[0]
          ? this.state.dropdownArr[0].account_id
          : "";
        const accountName = this.state.dropdownArr[0]
          ? this.state.dropdownArr[0].account_name
          : "";
        const accountType = this.state.dropdownArr[0]
          ? this.state.dropdownArr[0].account_type
          : "";
        title = "Thêm giao dịch thanh toán";
        fieldArr = [
          {
            key: "account",
            keyAlt: "Tài khoản",
            value: "",
            account_id: accountId,
            account_name: accountName,
            account_type: accountType,
            validate: true,
          },
          {
            key: "date",
            keyAlt: "Ngày",
            value: new Date().toISOString().slice(0, 10),
            validate: true,
          },
          {
            key: "money",
            keyAlt: "Số tiền",
            value: "",
            validate: true,
          },
        ];
        break;
      case "otherService":
        const serviceId = this.state.dropdownArr[0]
          ? this.state.dropdownArr[0].service_id
          : "";
        const serviceName = this.state.dropdownArr[0]
          ? this.state.dropdownArr[0].service_name
          : "";
        const servicePrice = this.state.dropdownArr[0]
          ? this.state.dropdownArr[0].service_price
          : "";
        title = "Thêm dịch vụ";
        fieldArr = [
          {
            key: "service",
            keyAlt: "Dịch vụ",
            value: "",
            validate: true,
            service_id: serviceId,
            service_name: serviceName,
            service_price: servicePrice,
          },
          {
            key: "quantity",
            keyAlt: "Số lượng",
            value: "",
            validate: true,
          },
          {
            key: "unitprice",
            keyAlt: "Đơn giá",
            value: servicePrice,
            validate: true,
            disabled: true,
          },
          {
            key: "date",
            keyAlt: "Ngày",
            value: new Date().toISOString().slice(0, 10),
            validate: true,
          },
          {
            key: "description",
            keyAlt: "Miêu tả",
            value: "",
            validate: true,
          },
        ];
        break;
      case "newContact":
        title = "Thêm khách hàng mới";
        fieldArr = [
          {
            key: "name",
            keyAlt: "Tên KH",
            value: "",
            validate: true,
          },
          {
            key: "phone",
            keyAlt: "Điện thoại",
            value: "",
            validate: true,
          },
          {
            key: "mail",
            keyAlt: "Email",
            value: "",
            validate: true,
          },
          {
            key: "contactId",
            keyAlt: "contactId",
            value: "",
            validate: true,
          },
        ];
        if (editData && Object.keys(editData).length > 0) {
          fieldArr[0].value = editData.contact_name;
          fieldArr[1].value = (editData.phone_1 || editData.phone_2).replace(
            /\s/g,
            ""
          );
          fieldArr[2].value = editData.email || "";
          fieldArr[3].value = editData.contact_id || "";
          title = "Chỉnh sửa thông tin khách hàng";
        }
        break;
      default:
    }
    this.setState({
      title: title,
      fieldArr: fieldArr,
    });
  }

  handleChangeInput(event, index) {
    let arr = JSON.parse(JSON.stringify(this.state.fieldArr));
    if (event.target.name === "money") {
      // arr[index].value = event.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      arr[index].value = event.target.value;
    } else if (event.target.name === "phone") {
      arr[index].value = event.target.value
        .replace(/\s/g, "")
        .replace(/[^0-9-]/g, "");
    } else {
      arr[index].value = event.target.value;
      if (event.target.name === "account") {
        const idx = this.state.dropdownArr.findIndex(
          (item) => item.account_name === event.target.value
        );
        if (idx !== -1) {
          arr[index].account_id = this.state.dropdownArr[idx].account_id;
          arr[index].account_name = this.state.dropdownArr[idx].account_name;
          arr[index].account_type = this.state.dropdownArr[idx].account_type;
        }
      } else if (event.target.name === "service") {
        const idx = this.state.dropdownArr.findIndex(
          (item) => item.service_name === event.target.value
        );
        if (idx !== -1) {
          arr[index].service_id = this.state.dropdownArr[idx].service_id;
          arr[index].service_name = this.state.dropdownArr[idx].service_name;
          arr[index].service_price = this.state.dropdownArr[idx].service_price;
          arr[2].value = this.state.dropdownArr[idx].service_price;
        }
      }
    }

    this.setState({
      fieldArr: arr,
    });
  }

  submitNewContact() {
    const submitData = {
      guest_name: this.state.fieldArr[0].value,
      phone: this.state.fieldArr[1].value,
      email: this.state.fieldArr[2].value,
    };

    apiService.createNewContact(submitData).then(response => {
      if (response.status === 200) {
        this.props.inOnHide(submitData);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  checkValidate() {
    let isValidate = true;
    const regexDate = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
    let arr = JSON.parse(JSON.stringify(this.state.fieldArr));

    switch (this.props.typeModal) {
      case "transactions":
        arr[0].validate = true;
        arr[1].validate = regexDate.test(arr[1].value);
        arr[2].validate = arr[2].value ? true : false;
        break;
      case "otherService":
        arr[0].validate = true;
        arr[1].validate = arr[1].value ? true : false;
        arr[2].validate = arr[2].value ? true : false;
        arr[3].validate = regexDate.test(arr[3].value);
        arr[4].validate = true;
        break;
      case "newContact":
        const regexPhone = /([03|06|07|08|09]|01[2|6|8|9])+([0-9]{9})\b/g;
        arr[0].validate = arr[0].value ? true : false;
        arr[1].validate = regexPhone.test(arr[1].value) && arr[1].value.length > 9 && arr[1].value.length < 12;
        arr[2].validate = true;
        break;
      default:
    }
    isValidate = arr[0].validate && arr[1].validate && arr[2].validate;

    this.setState({
      fieldArr: arr,
    });
    return isValidate;
  }

  updateCurrentContact() {
    let currentContact = this.props.editData;
    currentContact.contact_name = this.state.fieldArr[0].value;
    currentContact.phone_1 = this.state.fieldArr[1].value;
    currentContact.email = this.state.fieldArr[2].value;
    apiService.updateContact(currentContact).then(response => {
      if (response.status === 200) {
        this.props.inOnHide();
      }
    }).catch(err => {
      console.log(err);
    })
  }

  handleActionBtn() {
    if (this.checkValidate()) {
      if (this.props.typeModal === "newContact") {
        if (this.props.editData && Object.keys(this.props.editData).length > 0) {
          this.updateCurrentContact();
        } else {
          this.submitNewContact();
        }
      } else {
        this.props.inOnHide(this.state.fieldArr);
        this.setState({
          title: "",
          fieldArr: [],
          dropdownArr: [],
        });
      }
    }
  }

  render() {
    return (
      <Modal
        show={this.props.inShow}
        onHide={this.props.inOnHide}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {this.state.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {(this.state.fieldArr || []).map((item, index) => {
            let typeInput = "text";
            switch (item.key) {
              case "date":
                typeInput = "date";
                break;
              default:
            }
            if (index === 3 && this.props.typeModal === "newContact") {
              return null;
            }
            return (
              <div key={index}>
                {item.validate ? null : (
                  <p className={styles.validateCustom}>
                    {item.keyAlt} không hợp lệ
                  </p>
                )}
                <div className={styles.modalCustom + " input-group mb-3"}>
                  <div className="input-group-prepend">
                    <span className="input-group-text">{item.keyAlt}:</span>
                  </div>
                  {item.key !== "account" && item.key !== "service" ? (
                    <input
                      onChange={(e) => {
                        this.handleChangeInput(e, index);
                      }}
                      onBlur={() => {
                        this.checkValidate();
                      }}
                      type={typeInput}
                      className="form-control"
                      value={item.value.toLocaleString()}
                      name={item.key}
                      disabled={item.disabled ? "disabled" : ""}
                      maxLength={100}
                    />
                  ) : (
                      <select
                        className="form-control"
                        name={item.key}
                        onChange={(e) => {
                          this.handleChangeInput(e, index);
                        }}
                      >
                        {this.state.dropdownArr.map((item1, index1) => {
                          return (
                            <option key={index1}>
                              {item1.account_name || item1.service_name}
                            </option>
                          );
                        })}
                      </select>
                    )}
                </div>
              </div>
            );
          })}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              this.props.inOnHide();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              this.handleActionBtn();
            }}
          >
            {this.props.editData ? "Lưu" : "Thêm"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddItemModal;
