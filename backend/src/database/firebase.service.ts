import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin,
  ) {}

  private get firestore() {
    // Obtén la instancia de Firestore desde Firebase Admin
    return this.firebaseAdmin.firestore();
  }

  // Crear o actualizar un documento en colección 'usuarios' con id dado
  async crearOActualizarUsuario(id: string, data: any): Promise<void> {
    await this.firestore.collection('usuarios').doc(id).set(data, { merge: true });
  }

  // Obtener un documento por id en la colección 'usuarios'
  async obtenerUsuario(id: string): Promise<any | null> {
    const doc = await this.firestore.collection('usuarios').doc(id).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  // Listar todos los documentos en colección 'usuarios'
  async listarUsuarios(): Promise<any[]> {
    const snapshot = await this.firestore.collection('usuarios').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Eliminar un documento de la colección 'usuarios' por id
  async eliminarUsuario(id: string): Promise<void> {
    await this.firestore.collection('usuarios').doc(id).delete();
  }
}
