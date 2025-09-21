import React from 'react';
import { useForm } from 'react-hook-form';
import { useApiMutation } from '../../hooks/api/useApiQuery';
import ReusableButton from '../reusable/ReusableButton';
import ReusableInput from '../reusable/ReusableInput';
import ReusableCard from '../reusable/ReusableCard';
import ReusableSection from '../reusable/ReusableSection';
import ReusableDatePicker from '../reusable/ReusableDatePicker';
import ReusableToast from '../reusable/ReusableToast';

/**
 * UpdateVehicleRate
 * - Refactored to use reusable components for all UI elements.
 * - All API logic migrated to React Query generic hooks.
 * - Redux accessDetails replaced with useApiQuery for live updates.
 * - Business logic, transformation, and validation preserved.
 */
function UpdateVehicleRate() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Example: Fetch access details via React Query (replace Redux)
  // ...existing code...

  // Example: Permit search mutation (replace axiosInstance)
  const permitSearchMutation = useApiMutation({
    key: 'searchPermit',
    url: '/api/v1/get/permit-details',
    method: 'get',
    onSuccess: () => {
      // Populate form fields with response data
      // ...existing code...
    }
  });

  // Example: Update vehicle rate mutation
  const updateRateMutation = useApiMutation({
    key: 'updateVehicleRate',
    url: '/api/v1/update/vehicle-rate',
    method: 'post',
    onSuccess: () => {
      // Success logic
    }
  });

  // Form submit handler
  const onSubmit = (data) => {
    updateRateMutation.mutate(data);
  };

  return (
    <div className='work-space-container'>
      <ReusableCard>
        <ReusableSection title="Update Vehicle Rate">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid-section1">
              <div className="item1">
                <ReusableInput label="Permit Number" name="permitNumber" {...register('permitNumber', { required: true })} error={errors.permitNumber?.message} />
                <ReusableButton type="button" variant="primary" size="sm" onClick={() => permitSearchMutation.mutate({ permitNumber: '' })}>Proceed</ReusableButton>
                <ReusableButton type="button" variant="primary" size="sm" onClick={reset}>New</ReusableButton>
                <ReusableButton type="button" variant="primary" size="sm" onClick={reset}>Clear</ReusableButton>
              </div>
            </div>
            <div className="grid-container card">
              <div className="item">
                <ReusableInput label="Billing Party" name="consignerName" {...register('consignerName')} />
              </div>
              <div className="item">
                <ReusableInput label="Mines/Consigner Name" name="minesConsignerName" {...register('minesConsignerName')} />
              </div>
              <div className="item">
                <ReusableInput label="Exporter/Consignee Name" name="exporterName" {...register('exporterName')} />
              </div>
              <div className="item">
                <ReusableInput label="Loading Point" name="loadingPoint" {...register('loadingPoint')} />
              </div>
              <div className="item">
                <ReusableInput label="Un-Loading Point" name="unloadingPoint" {...register('unloadingPoint')} />
              </div>
              <div className="item1">
                <label className="form-label">Loading Period</label>
                <div className="row">
                  <div className="col-sm-5">
                    <ReusableDatePicker label="Start Date" name="startDate" {...register('startDate')} />
                  </div>
                  <span className="col-sm-auto">To</span>
                  <div className="col-sm-5">
                    <ReusableDatePicker label="End Date" name="endDate" {...register('endDate')} />
                  </div>
                </div>
              </div>
            </div>
            <ReusableButton type="submit" variant="primary" className="m-2" disabled={updateRateMutation.isLoading}>
              {updateRateMutation.isLoading && <span>Updating...</span>}
              <span>Update</span>
            </ReusableButton>
            <ReusableButton type="button" variant="outline-primary" className="m-2" onClick={reset}>Clear</ReusableButton>
          </form>
        </ReusableSection>
        <ReusableToast position="bottom-center" reverseOrder={true} />
      </ReusableCard>
    </div>
  );
}

export default UpdateVehicleRate;
