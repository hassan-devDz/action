export const deleteUser = (req, res) => {
  const { year } = await req.query;
  const { _id } = await req.body;
  const simple_query = {
    _id: new ObjectId(_id),
  };

  const deleteUser = await req.db
    .collection(`users_${year}`)
    .deleteOne(simple_query);
  const { deletedCount } = deleteUser;
  if (!deletedCount) {
    return res.status(400).json({ message: "معلومات غير موجودة" });
  }
  if (deletedCount) {
    return res.status(201).json({ message: "تم الحذف بنجاح" });
  }

  return res.status(422).json({ message: "حدث خطأ ما" });
};
