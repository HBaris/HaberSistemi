sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, JSONModel, Fragment) {
    "use strict";

    // Hardcode JSON verileri
    var oModel = new JSONModel({
        kayitlar: [
            {
                ad: "John",
                soyad: "Doe",
                email: "john.doe@example.com",
                telefon: "555-1234"
            },
            {
                ad: "Jane",
                soyad: "Smith",
                email: "jane.smith@example.com",
                telefon: "555-5678"
            }
            // diğer kayıtları buraya ekleyebilirsiniz...
        ]
    });

    return Controller.extend("app.controller.Main", {
        onInit: function () {
            // JSON Model'i view'a atayın
            this.getView().setModel(oModel,"modelName"); // Modeli "modelName" olarak view'a ata
        },

        onSavePress: function () {
            var oView = this.getView();
            var oEmailInput = oView.byId("input-c");
            var oPhoneInput = oView.byId("input-phone");
            var oData = {
                ad: oView.byId("input-a").getValue(),
                soyad: oView.byId("input-b").getValue(),
                email: oEmailInput.getValue(),
                telefon: oPhoneInput.getValue()
            };

            var bError = this._checkData(oData);
            if (bError) {
                MessageToast.show("Lütfen gerekli alanları düzgün bir şekilde doldurun.");
            } else {
                // Kaydetme işlemini burada yapabilirsiniz
                MessageToast.show("Form başarıyla kaydedildi!");
            }
        },

        _checkData: function (oData) {
            var bError = false;

            // Şartları kontrol et
            if (oData.ad.trim() === "") {
                bError = true;
                this.getView().byId("input-a").setValueState("Error");
            } else {
                this.getView().byId("input-a").setValueState("None");
            }

            if (oData.soyad.trim() === "") {
                bError = true;
                this.getView().byId("input-b").setValueState("Error");
            } else {
                this.getView().byId("input-b").setValueState("None");
            }

            if (!this.checkEmail(oData.email)) {
                bError = true;
                this.getView().byId("input-c").setValueState("Error");
            } else {
                this.getView().byId("input-c").setValueState("None");
            }

            if (oData.telefon.trim() === "") {
                bError = true;
                this.getView().byId("input-phone").setValueState("Error");
            } else {
                this.getView().byId("input-phone").setValueState("None");
            }

            return bError;
        },

        checkEmail: function (sEmail) {
            // E-posta adresini doğrulamak için regex
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(sEmail);
        },

        onEmailChange: function (oEvent) {
            var sEmail = oEvent.getParameter("value");
            var oInput = oEvent.getSource();

            if (this.checkEmail(sEmail)) {
                oInput.setValueState("None"); // E-posta doğruysa hata durumunu kaldır
            } else {
                oInput.setValueState("Error"); // E-posta yanlışsa hata durumunu göster
            }
        },

        onPhoneNumberChange: function (oEvent) {
            var sPhoneNumber = oEvent.getParameter("value");
            var oInput = oEvent.getSource();

            if (sPhoneNumber.length === 0 || sPhoneNumber.indexOf("_") >= 0) {
                oInput.setValueState("Error"); // Telefon numarası eksik girilmişse hata durumunu göster
            } else {
                oInput.setValueState("None"); // Telefon numarası girilmişse hata durumunu kaldır
            }
        },

        onAddNewRecordPress: function () {
            this._resetFormInputs();
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("app.view.AddRecordDialog", this);
                this.getView().addDependent(this._oDialog);
                this._oDialog.open();
            } else {
                this._oDialog.open();
            }
        },
        
        
        
        _resetFormInputs: function () {
            // JSON Model'i view'dan alın
            var oModel = this.getView().getModel("modelName");

            // Oluşturulan modeldeki "kayitlar" verilerini güncelleyin
            var aRecords = oModel.getProperty("/kayitlar");
            var oNewRecord = {
                ad: "",
                soyad: "",
                email: "",
                telefon: ""
            };
            aRecords.push(oNewRecord);
            oModel.setProperty("/kayitlar", aRecords);
        },
        
        onSaveNewRecordPress: function () {
            var oModel = this.getView().getModel();
            var oNewRecord = {
                ad: this.getView().byId("input-a").getValue(),
                soyad: this.getView().byId("input-b").getValue(),
                email: this.getView().byId("input-c").getValue(),
                telefon: this.getView().byId("input-phone").getValue()
            };
        
            // Yeni kayıt ekleme işlemleri, oNewRecord'ı oModel'e ekleyin
            var aRecords = oModel.getProperty("/kayitlar");
            aRecords.push(oNewRecord);
            oModel.setProperty("/kayitlar", aRecords);
        
            this._resetFormInputs();
            this._oDialog.close();
            MessageToast.show("Yeni kayıt başarıyla eklendi!");
        },
        

        onDeleteRowPress: function (oEvent) {
            var oRow = oEvent.getSource().getParent();
            this._oRowForDeletion = oRow;
            this.getView().byId("ConfirmDeleteDialog").open();
        },

        onDeleteConfirmed: function () {
            var oModel = this.getView().getModel();
            var oRow = this._oRowForDeletion;
            var sPath = oRow.getBindingContextPath();
            var iIndex = parseInt(sPath.split("/")[sPath.split("/").length - 1]);

            var aRecords = oModel.getProperty("/kayitlar");
            aRecords.splice(iIndex, 1);
            oModel.setProperty("/kayitlar", aRecords);

            this.getView().byId("ConfirmDeleteDialog").close();
            MessageToast.show("Kayıt başarıyla silindi!");
        },

        onDeleteCanceled: function () {
            this.getView().byId("ConfirmDeleteDialog").close();
        }
    });
});
