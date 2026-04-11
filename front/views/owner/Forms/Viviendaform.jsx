import React, { useState } from "react";
import { supabase } from "../../../config/supabase-client";
import useUser from "../../../stores/user-store";

export default function ViviendaForm({ show, onClose, onCreated }) {
  const loggedUserId = useUser((state) => state.loggedUser);

  const [formData, setFormData] = useState({
    name: "",
    postal_code: "",
    street: "",
    division: "",
    int_num: "",
    ext_num: "",
    city: "",
    state: ""
  });

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("apartments")
        .insert({
          ownerid: loggedUserId,
          name: formData.name,
          city: formData.city,
          state: formData.state,
          street: formData.street,
          postal_code: formData.postal_code,
          division: formData.division,
          int_num: formData.int_num,
          ext_num: formData.ext_num,
        });

      if (error) throw error;

      const newApartment = {
        ownerId: loggedUserId,
        name: formData.name,
        city: formData.city,
        state: formData.state,
        street: formData.street,
        postal_code: formData.postal_code,
        division: formData.division,
        int_num: formData.int_num,
        ext_num: formData.ext_num,
      };

      // Send created apartment to parent
      onCreated(newApartment);

      // Reset form
      setFormData({
        name: "",
        postal_code: "",
        street: "",
        division: "",
        int_num: "",
        ext_num: "",
        city: "",
        state: ""
      });

    } catch (err) {
      console.error(err);
      alert("Error creating apartment");
    };
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className="modal d-block">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4 shadow border-0">

            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Nueva Vivienda</h5>
              <button
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Calle</label>
                  <input
                    type="text"
                    className="form-control"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Núm Ext</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ext_num"
                      value={formData.ext_num}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Núm Int (Opcional)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="int_num"
                      value={formData.int_num}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Colonia</label>
                    <input
                      type="text"
                      className="form-control"
                      name="division"
                      value={formData.division}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">C.P.</label>
                    <input
                      type="text"
                      className="form-control"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Estado</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="btn btn-dark"
                  >
                    Guardar vivienda
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}