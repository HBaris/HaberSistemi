sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("app.controller.Main", {
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
        }
    });
    });

