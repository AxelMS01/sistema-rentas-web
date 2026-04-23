import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase-client";

/**
 * Fetches all the necessary data to render the contract's document, using the id of the related tenant.
 * @param {*} tenantId 
 * @param {*} ownerId 
 * @returns An object containing the rental contract, owner, tenant, guarantor, and apartment information to pass it to the contract document.
 */

export default function useContractData(tenantId, ownerId) {
    // State variables to save the fetched data into.
    const [isLoading, setIsLoading] = useState(true);
    const [contractInfo, setContractInfo] = useState();
    const [ownerInfo, setOwnerInfo] = useState();
    const [tenantInfo, setTenantInfo] = useState();
    const [guarantorInfo, setGuarantorInfo] = useState();
    const [apartmentInfo, setApartmentInfo] = useState();

    if (!tenantId) {
        return {
            isDataLoading: false,
            contractInfo: "",
            ownerInfo: "",
            tenantInfo: "",
            guarantorInfo: "",
            apartmentInfo: "",
        };
    };

    const fetchData = useCallback(
        async () => {
            try {
                const { data: contractData, error: contractError } = await supabase
                    .from("rentalcontracts")
                    .select()
                    .eq("tenantid", tenantId)

                if (contractError) throw contractError;
                setContractInfo(contractData[0]);

                // Variables for the rest of the tables.
                const ownerId = contractData[0].owner_id;
                const guarantorId = contractData[0].guarantorid;
                const apartmentId = contractData[0].apartmentid;

                const { data: ownerData, error: ownerError } = await supabase
                    .from("owners")
                    .select()
                    .eq("id", ownerId);

                if (ownerError) throw ownerError;
                setOwnerInfo(ownerData[0]);

                const { data: tenantData, error: tenantError } = await supabase
                    .from("tenants")
                    .select()
                    .eq("id", tenantId);

                if (tenantError) throw tenantError;
                setTenantInfo(tenantData[0]);

                const { data: guarantorData, error: guarantorError } = await supabase
                    .from("guarantors")
                    .select()
                    .eq("id", guarantorId);

                if (guarantorError) throw guarantorError;
                setGuarantorInfo(guarantorData[0]);

                const { data: apartmentData, error: apartmentError } = await supabase
                    .from("apartments")
                    .select()
                    .eq("id", apartmentId);

                if (apartmentError) throw apartmentError;
                setApartmentInfo(apartmentData[0]);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }, []
    );

    useEffect(() => {
        fetchData();
    }, []);

    return {
        isDataLoading: isLoading,
        contractInfo: contractInfo,
        ownerInfo: ownerInfo,
        tenantInfo: tenantInfo,
        guarantorInfo: guarantorInfo,
        apartmentInfo: apartmentInfo,
    };
}