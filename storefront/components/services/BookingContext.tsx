"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { submitWebsiteInquiry } from "@/actions/inquiries";

export interface BookingContextType {
  selectedForkliftType: "diesel" | "electric";
  setSelectedForkliftType: (val: "diesel" | "electric") => void;
  selectedHoursIndex: number;
  setSelectedHoursIndex: (val: number) => void;
  pmViewMode: "calculator" | "table";
  setPmViewMode: (val: "calculator" | "table") => void;
  activeEcosystemTab: number;
  setActiveEcosystemTab: (val: number) => void;
  isChecklistModalOpen: boolean;
  setIsChecklistModalOpen: (val: boolean) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  province: string;
  setProvince: (val: string) => void;
  brand: string;
  setBrand: (val: string) => void;
  urgency: "sale_inquiry" | "rental_b2b" | "standard" | "spare_parts";
  setUrgency: (val: "sale_inquiry" | "rental_b2b" | "standard" | "spare_parts") => void;
  issueDetails: string;
  setIssueDetails: (val: string) => void;
  submissionStatus: "idle" | "submitting" | "success" | "error";
  submissionReference: string;
  submissionMessage: string;
  handleBookPackage: (hoursIndex: number, pkgNameLo: string, pkgNameEn: string, label: string, isLo: boolean) => void;
  handleBookConsultation: (topic: string) => void;
  handleBookingSubmit: (e: React.FormEvent, isLo: boolean) => Promise<void>;
}

export const BookingContext = createContext<BookingContextType | null>(null);

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookingContext must be used within a BookingProvider");
  }
  return context;
}

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedForkliftType, setSelectedForkliftType] = useState<"diesel" | "electric">("diesel");
  const [selectedHoursIndex, setSelectedHoursIndex] = useState<number>(1);
  const [pmViewMode, setPmViewMode] = useState<"calculator" | "table">("table");
  const [activeEcosystemTab, setActiveEcosystemTab] = useState<number>(0);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState<boolean>(false);
  
  const [companyName, setCompanyName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [province, setProvince] = useState<string>("ນະຄອນຫຼວງວຽງຈັນ");
  const [brand, setBrand] = useState<string>("Toyota");
  const [urgency, setUrgency] = useState<"sale_inquiry" | "rental_b2b" | "standard" | "spare_parts">("rental_b2b");
  const [issueDetails, setIssueDetails] = useState<string>("");
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submissionReference, setSubmissionReference] = useState<string>("");
  const [submissionMessage, setSubmissionMessage] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const unitId = params.get("unit");
    if (!unitId) return;

    const model = params.get("model");
    const brandName = params.get("brand");
    const location = params.get("location");
    setUrgency("standard");
    if (brandName) setBrand(brandName);
    setIssueDetails(
      [
        `Fleet PM request for unit ${unitId}`,
        model ? `Model: ${model}` : null,
        brandName ? `Brand: ${brandName}` : null,
        location ? `Operating location: ${location}` : null,
      ].filter(Boolean).join("\n")
    );
  }, []);

  const handleBookPackage = (hoursIndex: number, pkgNameLo: string, pkgNameEn: string, label: string, isLo: boolean) => {
    setSelectedHoursIndex(hoursIndex);
    setUrgency("standard");
    const pkgLabel = isLo ? `${pkgNameLo} (${label})` : `${pkgNameEn} (${label})`;
    setIssueDetails(
      isLo
        ? `ຕ້ອງການຈອງແພັກເກັດບຳລຸງຮັກສາ ${pkgLabel} ສຳລັບລົດຍົກ ${selectedForkliftType === "diesel" ? "ດີເຊວ" : "ໄຟຟ້າ"}`
        : `Requesting booking for maintenance package: ${pkgLabel} for ${selectedForkliftType === "diesel" ? "Diesel" : "Electric"} Forklift`
    );
    const formElement = document.getElementById("booking-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookConsultation = (topic: string) => {
    setUrgency("sale_inquiry");
    setIssueDetails(topic);
    const formElement = document.getElementById("booking-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent, isLo: boolean) => {
    e.preventDefault();
    setSubmissionStatus("submitting");
    setSubmissionReference("");
    setSubmissionMessage("");

    const result = await submitWebsiteInquiry({
      inquiry_type: "service",
      category: urgency,
      customer_name: companyName.trim(),
      company_name: companyName.trim(),
      phone_number: phone.trim(),
      province,
      brand,
      details: issueDetails || (isLo ? "ຕ້ອງການຂໍຄຳປຶກສາ" : "Requesting a consultation"),
    });

    if (!result.success) {
      setSubmissionStatus("error");
      setSubmissionMessage(result.message);
      return;
    }

    setSubmissionStatus("success");
    setSubmissionReference(result.reference_number);
    setSubmissionMessage(
      isLo
        ? "ຄຳຮ້ອງຂໍຖືກບັນທຶກໃນ CRM ແລ້ວ. ທີມງານຈະຕິດຕໍ່ກັບເພື່ອຢືນຢັນ."
        : "Your request was saved to CRM. Our team will contact you to confirm the details.",
    );
  };

  return (
    <BookingContext.Provider value={{
      selectedForkliftType, setSelectedForkliftType,
      selectedHoursIndex, setSelectedHoursIndex,
      pmViewMode, setPmViewMode,
      activeEcosystemTab, setActiveEcosystemTab,
      isChecklistModalOpen, setIsChecklistModalOpen,
      companyName, setCompanyName,
      phone, setPhone,
      province, setProvince,
      brand, setBrand,
      urgency, setUrgency,
      issueDetails, setIssueDetails,
      submissionStatus, submissionReference, submissionMessage,
      handleBookPackage, handleBookConsultation, handleBookingSubmit
    }}>
      {children}
    </BookingContext.Provider>
  );
};
