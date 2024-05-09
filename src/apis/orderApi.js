import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import i18n from 'i18next';
import { pick } from 'lodash';

import { db } from '~/config';
import { COLLECTIONS, MEMBERSHIP, ORDER_STATUSES } from '~/constants';
import { getMaxDiscountValue, getMembershipLevel } from '~/utils';

const add = async (userId, data) => {
  try {
    const items = data.map((element) => {
      return pick(element, ['id', 'price', 'priceOld', 'quantity']);
    });

    const total = items.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0,
    );

    const userRef = doc(db, COLLECTIONS.USERS, userId);

    const docSnap = await getDoc(userRef);

    const user = docSnap.data();

    const userPick = pick(user, ['fullname', 'address', 'phoneNumber']);

    const userLevel = user?.membership?.level ?? MEMBERSHIP.SILVER;
    const discountAmount = getMaxDiscountValue(userLevel, total);
    const totalAmount = total - discountAmount;

    const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
      uid: userId,
      items: items,
      status: ORDER_STATUSES.PENDING,
      totalAmount: totalAmount,
      discountAmount: discountAmount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      address: userPick,
    });

    // Add the id field
    await updateDoc(docRef, {
      id: docRef.id,
    });

    const totalPayment =
      user?.membership?.totalPayment === undefined
        ? totalAmount
        : totalAmount + user?.membership?.totalPayment;

    // // cập nhật trạng thái thành viên
    // await updateDoc(userRef, {
    //   membership: {
    //     level: getMembershipLevel(totalPayment),
    //     totalPayment: totalPayment,
    //   },
    // });

    return {
      status: 'success',
    };
  } catch (error) {
    console.log(error);
  }
};

/**
 * Cập nhật lại trạng thái đơn hàng với vai trò Admin
 */
const updateStatus = async (docId, status) => {
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, docId);

    const orderSnap = await getDoc(docRef);

    const order = orderSnap.data();

    const userId = order.uid;

    const userRef = doc(db, COLLECTIONS.USERS, userId);

    const userSnap = await getDoc(userRef);

    const userData = userSnap.data();

    const { membership } = userData;

    // tổng tiền đã giao dịch thành công
    let totalPayment = 0;

    const currentStatus = order.status;

    if (
      status == ORDER_STATUSES.COMPLETED &&
      currentStatus != ORDER_STATUSES.COMPLETED
    ) {
      totalPayment = (membership.totalPayment ?? 0) + order.totalAmount;
    }

    if (
      status != ORDER_STATUSES.COMPLETED &&
      currentStatus == ORDER_STATUSES.COMPLETED
    ) {
      const result = (membership.totalPayment ?? 0) - order.totalAmount;
      totalPayment = result > 0 ? result : 0;
    }

    await updateDoc(docRef, {
      status,
    });

    console.log(totalPayment);

    await updateDoc(userRef, {
      membership: {
        level: getMembershipLevel(totalPayment),
        totalPayment: totalPayment,
      },
    });

    return {
      status: 'success',
      message: i18n.t('successfully'),
    };
  } catch (error) {
    console.log(error);
  }
};

export const orderApi = {
  add,
  updateStatus,
};
