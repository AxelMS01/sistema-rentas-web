import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../config/supabase-client";

/**
 * Fetches all the necessary data to render the contract's document, using the id of the related tenant.
 * @param {*} tenantId 
 * @param {*} ownerId 
 * @returns An object containing the rental contract, owner, tenant, guarantor, and apartment information to pass it to the contract document.
 */

export default function useContractData(tenantId, ownerId) {
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

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        try {
            const { data: contractData, error: contractError } = await supabase
                .from("rentalcontracts")
                .select()
                .eq("tenantid", tenantId)
                .limit(1);

            if (contractError) throw contractError;

            const currentContract = contractData?.[0];

            if (!currentContract) {
                setContractInfo(undefined);
                setOwnerInfo(undefined);
                setTenantInfo(undefined);
                setGuarantorInfo(undefined);
                setApartmentInfo(undefined);
                return;
            }

            setContractInfo(currentContract);

            const currentOwnerId = currentContract.owner_id;
            const guarantorId = currentContract.guarantorid;
            const apartmentId = currentContract.apartmentid;

            const [
                ownerResponse,
                tenantResponse,
                guarantorResponse,
                apartmentResponse,
            ] = await Promise.all([
                supabase.from("owners").select().eq("id", currentOwnerId).limit(1),
                supabase.from("tenants").select().eq("id", tenantId).limit(1),
                supabase.from("guarantors").select().eq("id", guarantorId).limit(1),
                supabase.from("apartments").select().eq("id", apartmentId).limit(1),
            ]);

            if (ownerResponse.error) throw ownerResponse.error;
            if (tenantResponse.error) throw tenantResponse.error;
            if (guarantorResponse.error) throw guarantorResponse.error;
            if (apartmentResponse.error) throw apartmentResponse.error;

            setOwnerInfo(ownerResponse.data?.[0]);
            setTenantInfo(tenantResponse.data?.[0]);
            setGuarantorInfo(guarantorResponse.data?.[0]);
            setApartmentInfo(apartmentResponse.data?.[0]);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [tenantId, ownerId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        isDataLoading: isLoading,
        contractInfo: contractInfo,
        ownerInfo: ownerInfo,
        tenantInfo: tenantInfo,
        guarantorInfo: guarantorInfo,
        apartmentInfo: apartmentInfo,
        refetchContractData: fetchData,
    };
}
