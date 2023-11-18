/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import type {FC, SyntheticEvent} from "react";

import {useState} from "react";
import {useRouter} from "next/navigation";

import {SPORT_CENTER_APPROVED, SPORT_CENTER_REJECTED} from "@/backend/db/models/sportsCenters";
import {errorToast, successToast} from "@/lib/utils/toasts";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {Button} from "../ui/button";
import {Textarea} from "../ui/textarea";

interface SportCenterDenyAlertProps {
  sportCenterId: number;
}

// eslint-disable-next-line react/function-component-definition
export const SportCenterDenyAlert: FC<SportCenterDenyAlertProps> = ({sportCenterId}) => {
  const [reason, setReason] = useState("");

  const handleValueChange = (event: SyntheticEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setReason(event.target.value);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Rechazar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Motivo de Rechazo</AlertDialogTitle>
          <AlertDialogDescription>
            Breve detalle del motivo por el cual se rechazo la solicitud.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Textarea
          defaultValue={reason}
          placeholder="Escriba un motivo..."
          onChange={handleValueChange}
        />

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setReason("");
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            role="button"
            onClick={() => handleOnClick(sportCenterId, SPORT_CENTER_REJECTED, reason)}
          >
            Rechazar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface SportCenterConfirmAlertProps {
  sportCenterId: number;
  sportCenterName: string;
}

// eslint-disable-next-line react/function-component-definition
export const SportCenterConfirmAlert: FC<SportCenterConfirmAlertProps> = ({
  sportCenterId,
  sportCenterName,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Aprobar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Esta seguro que quiere habilitar el establecimiento <strong>{sportCenterName}</strong>?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            role="button"
            onClick={() => handleOnClick(sportCenterId, SPORT_CENTER_APPROVED, "")}
          >
            Aprobar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const handleOnClick = async (sportCenterId: number, state: string, reason: string) => {
  const res = await fetch(`/api/sportcenter/${sportCenterId}`, {
    method: "PUT",
    body: JSON.stringify({state, reason}),
    headers: {"Content-Type": "application/json"},
  }).catch(() => errorToast("No se pudo realizar la operacion. Intentelo nuevamente"));

  const data: {data: any; status: number; message: string} = await res.json();

  if (data.status === 200) {
    successToast(data.message);
  } else {
    errorToast(data.message);
  }
};
